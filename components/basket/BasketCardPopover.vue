<template>
  <div
    class="relative m-3 flex flex-col rounded border p-3 text-primary hover:bg-secondary-450">
    <DefaultLink
      v-if="mainItem"
      :to="getProductDetailRoute(mainItem.product)"
      class="flex text-sm"
      :class="{ 'opacity-40': isSoldOut }">
      <div class="mr-5 flex flex-1">
        <div class="flex-none shrink-0">
          <div class="w-16">
            <NuxtImg
              v-if="imageHash"
              :src="imageHash"
              :alt="name"
              provider="default"
              class="object-cover"
              height="144" />
          </div>
        </div>
        <div
          class="ml-2 flex grow flex-col justify-center"
          :class="{ 'flex-row': isLightVariant }">
          <p class="text-sm font-semibold">
            <span v-if="name" class="text-xs text-secondary">{{ name }}</span>
            <br />
            <span v-if="title">{{ title }}</span>
          </p>
          <div class="text-xs text-secondary">
            <p>
              {{ $t('basket_card.size_label') }}:
              <span class="font-bold text-primary">{{ size }}</span>
            </p>
            <p v-if="mainItem.variant?.attributes?.cupsize">
              {{ $t('basket_card.cup_size_label') }}:
              <span class="font-bold text-primary">{{ cupsizeLabel }}</span>
            </p>
            <p>
              {{ $t('basket_card.quantity_label') }}:
              <span class="font-bold text-primary">
                {{ mainItem.quantity }}
              </span>
            </p>
            <p>
              {{ $t('basket_card.color_label') }}:
              <span class="font-bold text-primary">{{ color }}</span>
            </p>
            <p v-if="isSoldOut">
              <ProductBadge class="ml-0" :badge-label="badgeLabel" />
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-end">
        <section class="flex flex-col items-end justify-end">
          <p
            v-if="
              reducedPrice &&
              reducedPrice > -1 &&
              priceWithTax &&
              priceWithTax > -1
            "
            class="text-sm text-gray-500 line-through">
            {{ toCurrency(priceWithTax + reducedPrice) }}
          </p>
          <Headline
            v-if="priceWithTax"
            tag="p"
            size="base"
            is-uppercase
            :class="{ 'text-red-500': reducedPrice }">
            {{ toCurrency(priceWithTax) }}
          </Headline>
          <p class="text-xs text-secondary">
            {{ $t('incl_tax') }}
          </p>
        </section>
      </div>
    </DefaultLink>
    <div v-if="addOnItems.length">
      <AddOnItems :items="addOnItems" class="mt-3" size-mode="sm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BasketItem,
  getAppliedReductionsByCategory,
  getBadgeLabel,
  getFirstAttributeValue,
  getProductColors,
  getSizeFromVariant,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  items: {
    type: Array as PropType<BasketItem[]>,
    required: true,
    default: () => [],
  },
  isOnWishlist: {
    type: Boolean,
    default: false,
  },
  hasBasketAction: {
    type: Boolean,
    default: false,
  },
  hasWishlistAction: {
    type: Boolean,
    default: false,
  },
  hasQuantityAction: {
    type: Boolean,
    default: false,
  },
  isLightVariant: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'click:delete',
  'click:add-to-wishlist',
  'click:remove-from-wishlist',
])

const mainItem = computed(() => {
  return props.items.length === 1
    ? props.items[0]
    : props.items.find((item) => item.itemGroup?.isMainItem)
})

const title = computed(() => {
  return getFirstAttributeValue(mainItem.value?.product?.attributes, 'brand')
    ?.label
})

const name = computed(() => {
  return getFirstAttributeValue(mainItem.value?.product?.attributes, 'name')
    ?.label
})

const color = computed(() => {
  return (
    mainItem.value &&
    getProductColors(mainItem.value?.product, 'color').join('/')
  )
})

const priceWithTax = computed(() => mainItem.value?.price.total.withTax)

const reducedPrice = computed(() => {
  return (
    mainItem.value &&
    getAppliedReductionsByCategory(mainItem.value?.price.total, 'sale')[0]
      ?.amount.absoluteWithTax
  )
})

const isSoldOut = computed(() => mainItem.value?.product.isSoldOut)

const imageHash = computed(() => {
  return (
    mainItem.value &&
    getImageFromList(
      mainItem.value?.product.images,
      ProductImageType.BUST,
      'front',
    )?.hash
  )
})

const size = computed(() => {
  return (
    mainItem.value && getSizeFromVariant(mainItem.value?.variant, 'size')?.label
  )
})

const cupsizeLabel = computed(() => {
  return getFirstAttributeValue(mainItem.value?.variant.attributes, 'cupsize')
    ?.label
})

const badgeLabel = computed(() => {
  return getBadgeLabel({
    isSoldOut: mainItem.value?.product.isSoldOut,
  })
})

const addOnItems = computed(() =>
  props.items.filter((item) => item.itemGroup && !item.itemGroup.isMainItem),
)
</script>
