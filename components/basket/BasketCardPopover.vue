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
import { type BasketItem } from '@scayle/storefront-nuxt'

type Props = {
  items: BasketItem[]
  isOnWishlist?: boolean
  hasBasketAction?: boolean
  hasWishlistAction?: boolean
  hasQuantityAction?: boolean
  isLightVariant?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOnWishlist: false,
  hasBasketAction: false,
  hasWishlistAction: false,
  hasQuantityAction: false,
  isLightVariant: false,
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

const {
  name,
  brand: title,
  size,
  image,
  color,
  price: priceWithTax,
  cupsizeLabel,
  reducedPrice,
  isSoldOut,
  badgeLabel,
} = await useBasketItem(mainItem)

const { isFreeGift, backgroundColorStyle } = useBasketItemPromotion(mainItem)

const addOnItems = computed(() =>
  props.items.filter((item) => item.itemGroup && !item.itemGroup.isMainItem),
)
</script>
