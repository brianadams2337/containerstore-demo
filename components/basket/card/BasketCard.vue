<template>
  <FadeInTransition>
    <div
      v-if="uiState === 'default'"
      data-test-id="basket-card"
      class="w-full rounded border border-gray-350 p-4 text-sm lg:p-5"
    >
      <div class="flex w-full" :class="{ 'opacity-50': !inStock }">
        <div
          class="flex w-28 items-center pr-3 lg:w-48 lg:p-0 lg:pr-6 relative"
          @click.capture="selectItem"
        >
          <DefaultLink
            :to="getProductDetailRoute(product)"
            class="h-full rounded-md bg-gray-200 p-2"
          >
            <ProductImage
              v-if="image"
              :image="image"
              :alt="name"
              fit="cover"
              sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
            />
            <ProductBadges
              :product="product"
              :is-promotion-badge-full-width="false"
              class="absolute"
            />
            <FadeInTransition>
              <ProductPromotionFreeGiftBadge
                v-if="isFreeGift"
                :background-color-style="giftBackgroundColorStyle"
                class="absolute bottom-2 left-2"
              />
            </FadeInTransition>
          </DefaultLink>
        </div>
        <div
          class="flex flex-1 flex-col justify-center gap-2 lg:flex-row lg:gap-0 lg:p-0"
        >
          <div class="flex grow flex-col justify-between gap-2 lg:pt-4">
            <div @click.capture="selectItem">
              <DefaultLink :to="getProductDetailRoute(product)" class="block">
                <BasketCardDetail
                  v-if="brand && name"
                  :label="brand"
                  :value="name"
                  primary
                />
              </DefaultLink>
            </div>
            <BasketCardDetail
              v-if="size"
              :label="$t('basket_card.size_label')"
              :value="size"
            />
            <BasketCardDetail
              v-if="color"
              :label="$t('basket_card.color_label')"
              :value="color"
            />
            <div v-if="!inStock" class="flex gap-2 text-gray-800">
              <p class="pr-3">{{ $t('global.sold_out') }}</p>
            </div>
          </div>
          <div class="flex items-end justify-between gap-2 lg:flex-col">
            <div>
              <Dropdown
                v-if="inStock"
                :disabled="isFreeGift"
                :model-value="quantity"
                :items="availableQuantity"
                @update:model-value="changeQuantity($event, index)"
              />
            </div>
            <div
              class="flex flex-col items-end justify-start text-right font-bold"
            >
              <template v-if="reducedPrice">
                <div
                  class="flex"
                  :class="{
                    'flex-col items-end':
                      hasSaleReduction(item) && !hasPromotionReduction(item),
                    'flex-row items-center ':
                      hasSaleReduction(item) && hasPromotionReduction(item),
                  }"
                >
                  <span
                    class="text-xs leading-[1.125rem] text-secondary line-through p-1"
                  >
                    {{ formatCurrency(price + reducedPrice) }}
                  </span>
                  <span
                    v-if="hasSaleReduction(item)"
                    class="p-1 text-base leading-5 text-red"
                    :class="{
                      'text-xs leading-[1.125rem] text-secondary line-through':
                        hasPromotionReduction(item),
                    }"
                  >
                    {{ formatCurrency(getItemSaleReductionPrice(item)) }}
                  </span>
                </div>
                <span
                  v-if="hasPromotionReduction(item)"
                  class="inline rounded p-1 text-base leading-5"
                  :style="{
                    ...getBackgroundColorStyle(
                      item?.promotion?.customData.colorHex,
                      10,
                    ),
                    ...getTextColorStyle(
                      item?.promotion?.customData.colorHex,
                      100,
                    ),
                  }"
                >
                  {{ formatCurrency(price) }}
                </span>
              </template>
              <span v-else class="text-base leading-5">
                {{ formatCurrency(price) }}
              </span>
              <p
                v-if="
                  isLowestPreviousPriceActive &&
                  reducedPrice &&
                  lowestPriorPrice?.withTax &&
                  lowestPriorPrice?.relativeDifferenceToPrice
                "
                class="mt-0.5 text-sm text-gray-700"
              >
                {{ $t('price.best_price_30d') }}
                {{ formatCurrency(lowestPriorPrice.withTax) }}
                ({{ lowestPriorPrice.relativeDifferenceToPrice * 100 }})%
              </p>
              <p class="text-2xs font-medium opacity-50">
                {{ $t('incl_tax') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end pt-4">
        <BasketCardAction
          :data-test-id="
            isInWishlist
              ? 'basket-remove-from-wishlist-button'
              : 'basket-add-to-wishlist-button'
          "
          :disabled="isWishlistToggling"
          @click="toggleWishlist"
        >
          <template #icon="{ _class }">
            <IconHeartFull v-if="isInWishlist" :class="_class" />
            <IconHeart v-else :class="_class" />
          </template>
          <span class="max-md:hidden">
            {{
              isInWishlist
                ? $t('basket_card.remove_from_wishlist_label')
                : $t('basket_card.add_to_wishlist_label')
            }}
          </span>
        </BasketCardAction>

        <BasketCardAction
          data-test-id="basket-remove-item-button"
          class="ml-1"
          @click="onPressDelete"
        >
          <template #icon="{ _class }">
            <IconCloseS :class="_class" />
          </template>
          {{ $t('basket_card.remove_label') }}
        </BasketCardAction>
      </div>
      <div v-if="addOnItems.length" class="ml-8 mt-8 overflow-hidden">
        <AddOnItems :items="addOnItems" />
      </div>
    </div>
    <BasketCardConfirmDelete
      v-else-if="uiState === 'confirmDelete' && image?.hash"
      key="confirmDelete"
      :name="name ?? ''"
      :image-hash="image.hash"
      @click:confirm="onConfirmDelete"
      @click:cancel="onCancelDelete"
    />
  </FadeInTransition>
</template>

<script setup lang="ts">
import { type BasketItem } from '@scayle/storefront-nuxt'
import { useBasketReductions } from '~/composables/useBasketReductions'

type Props = {
  index: number
  item?: BasketItem
  itemsGroup?: BasketItem[]
}

const props = withDefaults(defineProps<Props>(), {
  item: undefined,
  itemsGroup: undefined,
})
function getItemSaleReductionPrice(item?: BasketItem) {
  if (!item) return 0
  const itemTotalSalePrice = getBasketItemSalePrice(item)
  const totalWithReduction = price.value + (reducedPrice.value ?? 0)
  return _sum([totalWithReduction, -itemTotalSalePrice])
}

const { formatCurrency } = useFormatHelpers()
const { hasSaleReduction, hasPromotionReduction, getBasketItemSalePrice } =
  await useBasketReductions()
const { getProductDetailRoute } = useRouteHelpers()
const mainItem = computed(() => {
  const basketItem = props.itemsGroup
    ? props.itemsGroup.find((item) => item.itemGroup?.isMainItem)
    : props.item

  return basketItem as BasketItem
})

const {
  uiState,
  name,
  brand,
  size,
  inStock,
  image,
  color,
  onCancelDelete,
  onConfirmDelete,
  isLowestPreviousPriceActive,
  changeQuantity,
  price,
  availableQuantity,
  onPressDelete,
  quantity,
  lowestPriorPrice,
  reducedPrice,
  product,
  variant,
  selectItem,
  listingMetaData,
} = await useBasketItem(mainItem)

const { $i18n } = useNuxtApp()
const wishlist = await useWishlist()
const { trackRemoveFromWishlist, trackAddToWishlist } = useTrackingEvents()

const notification = useNotification()

const { pageState } = usePageState()
const route = useRoute()

const isWishlistToggling = ref(false)
const index = toRef(props, 'index')

const { isFreeGift, giftBackgroundColorStyle } =
  await useBasketItemPromotion(mainItem)

const addOnItems = computed(() =>
  props.itemsGroup
    ? props.itemsGroup.filter((item) => !item.itemGroup?.isMainItem)
    : [],
)

const isInWishlist = computed(() => {
  return wishlist.contains({ productId: product.value.id })
})

const toggleWishlist = async () => {
  isWishlistToggling.value = true
  await (isInWishlist.value ? removeFromWishlist() : addToWishlist())
  isWishlistToggling.value = false
}

const addToWishlist = async () => {
  if (!mainItem.value) {
    return
  }

  trackAddToWishlist({
    product: product.value,
    variant: variant.value,
    quantity: quantity.value,
    listingMetaData,
    index: index.value,
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: route.params.id?.toString() || '',
    },
  })

  await wishlist.addItem({ productId: product.value.id })
  const message = $i18n.t('wishlist.notification.add_to_wishlist', {
    productName: name.value || $i18n.t('wishlist.product'),
  })
  notification.show(message, 'ROUTE', { to: '/wishlist' })
}

const removeFromWishlist = async () => {
  const productName = name.value || $i18n.t('wishlist.product')
  const message = $i18n.t('wishlist.notification.remove_from_wishlist', {
    productName,
  })
  trackRemoveFromWishlist({
    product: product.value,
    variant: variant.value,
    quantity: quantity.value,
    index: index.value,
    listingMetaData: { ...listingMetaData, index: index.value },
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: route.params.id?.toString() || '',
    },
  })

  const data = wishlist.findItem({ variantId: variant.value.id })
    ? { variantId: variant.value.id }
    : { productId: product.value.id }

  await wishlist.removeItem(data)

  notification.show(message, 'CONFIRM')
}
</script>
