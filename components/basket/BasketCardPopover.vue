<template>
  <div
    class="relative m-3 flex flex-col rounded border p-3 text-primary hover:bg-secondary-450"
  >
    <DefaultLink
      v-if="mainItem"
      :to="getProductDetailRoute(mainItem.product)"
      class="flex text-sm"
      :class="{ 'opacity-40': isSoldOut }"
    >
      <div class="mr-5 flex flex-1">
        <div
          class="relative w-20 flex-none shrink-0 rounded-md bg-gray-200 p-2"
        >
          <ProductImage
            v-if="image"
            :image="image"
            :alt="name"
            fit="cover"
            height="144"
            sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
          />
          <ProductPromotionFreeGiftBadge
            v-if="isFreeGift"
            v-bind="{ backgroundColorStyle }"
            class="absolute bottom-2 left-2"
          />
        </div>
        <div
          class="ml-2 flex grow flex-col justify-center"
          :class="{ 'flex-row': isLightVariant }"
        >
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
              <ProductBadge class="mt-2" :badge-label="badgeLabel" />
            </p>
          </div>
        </div>
      </div>
      <div class="flex items-end">
        <section class="flex flex-col items-end justify-end">
          <p v-if="reducedPrice" class="text-sm text-gray-500 line-through">
            {{ toCurrency(priceWithTax + reducedPrice) }}
          </p>
          <Headline
            tag="p"
            size="base"
            is-uppercase
            :class="{ 'text-red-500': reducedPrice }"
          >
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
  type BasketItem,
  getTotalAppliedReductions,
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
  const basketItem =
    props.items.length === 1
      ? props.items[0]
      : props.items.find((item) => item.itemGroup?.isMainItem)

  return basketItem as BasketItem
})

const { isFreeGift, backgroundColorStyle } = useBasketItemPromotion(mainItem)

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

const priceWithTax = computed(() => mainItem.value?.price.total.withTax ?? 0)

const reducedPrice = computed(() => {
  const total = mainItem.value?.price.total
  if (!total) {
    return
  }
  return getTotalAppliedReductions(total)?.absoluteWithTax
})

const isSoldOut = computed(() => mainItem.value?.product.isSoldOut)

const image = computed(() => {
  return (
    mainItem.value &&
    getImageFromList(
      mainItem.value?.product.images,
      ProductImageType.BUST,
      'front',
    )
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
