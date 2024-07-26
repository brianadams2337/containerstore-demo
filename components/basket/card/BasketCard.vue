<template>
  <SFFadeInTransition>
    <div
      v-if="uiState === 'default'"
      data-test-id="basket-card"
      class="w-full rounded border border-gray-350 p-4 text-sm lg:p-5"
    >
      <div class="flex w-full" :class="{ 'opacity-50': !inStock }">
        <div
          class="relative flex w-28 shrink-0 items-center pr-3 lg:w-48 lg:p-0 lg:pr-6"
          @click.capture="selectItem"
          @keydown.enter="selectItem"
        >
          <SFLink
            :to="getProductDetailRoute(product)"
            class="grid h-full grid-cols-1 grid-rows-1 rounded-md bg-gray-200 p-2"
          >
            <ProductImage
              v-if="image"
              :image="image"
              :alt="name"
              fit="cover"
              sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
              class="col-start-1 col-end-1 row-start-1 row-end-1"
            />
            <ProductCardBadgesHeader
              class="absolute left-2 top-2"
              :product="product"
            />

            <ProductCardBadgesFooter
              class="col-start-1 col-end-1 row-start-1 row-end-1 max-w-fit self-end"
              :product="product"
              :is-promotion-badge-full-width="false"
            />
            <SFFadeInTransition>
              <ProductPromotionFreeGiftBadge
                v-if="isFreeGift"
                :background-color-style="giftBackgroundColorStyle"
                class="absolute bottom-2 left-2"
              />
            </SFFadeInTransition>
          </SFLink>
        </div>
        <div
          class="flex flex-1 flex-col justify-center gap-2 overflow-hidden lg:flex-row lg:gap-0 lg:p-0"
        >
          <div class="flex grow flex-col justify-between gap-2 lg:pt-4">
            <div>
              <SFLink
                :to="getProductDetailRoute(product)"
                class="block !whitespace-normal"
                @click.capture="selectItem"
                @keydown.enter="selectItem"
              >
                <BasketCardDetail
                  v-if="brand && name"
                  :label="brand"
                  :value="name"
                  primary
                />
              </SFLink>
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
            <div v-if="!inStock" class="flex gap-2 text-gray-600">
              <p class="pr-3">{{ $t('global.sold_out') }}</p>
            </div>
          </div>
          <div class="flex items-end justify-between gap-2 lg:flex-col">
            <div>
              <SFDropdown
                v-if="inStock"
                :disabled="isFreeGift"
                :model-value="quantity"
                :items="availableQuantity"
                @update:model-value="changeQuantity($event, index)"
              />
            </div>
            <div
              class="flex flex-col items-end justify-start text-right font-bold"
              data-test-id="basket-card-prices"
            >
              <template v-if="reducedPrice">
                <div
                  class="flex"
                  :class="
                    hasSaleReduction(item) && {
                      'flex-col items-end': !hasPromotionReduction(item),
                      'flex-row items-center ': hasPromotionReduction(item),
                    }
                  "
                >
                  <span
                    class="p-1 text-xs leading-[1.125rem] text-secondary line-through"
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
                  data-test-id="basket-card-reduction-price"
                  :style="{
                    ...getBackgroundColorStyle(
                      item?.promotion?.customData.colorHex,
                      AlphaColorMap.ALPHA_10,
                    ),
                    ...getTextColorStyle(
                      item?.promotion?.customData.colorHex,
                      AlphaColorMap.ALPHA_100,
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
                {{ $t('price.best_price_30d') }}**:
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
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { sum } from 'radash'
import { computed, ref, toRef } from 'vue'
import { type BasketItem } from '@scayle/storefront-nuxt'
import { useRoute } from '#app/composables/router'
import { useNuxtApp } from '#app'
import { useFormatHelpers, useWishlist } from '#storefront/composables'
import {
  useBasketItem,
  useBasketItemPromotion,
  useBasketReductions,
  usePageState,
  useRouteHelpers,
  useToast,
  useTrackingEvents,
} from '~/composables'
import { getBackgroundColorStyle, getTextColorStyle, routeList } from '~/utils'
import { AlphaColorMap } from '~/constants'

type Props = {
  index: number
  item?: BasketItem
  itemsGroup?: BasketItem[]
}

const props = withDefaults(defineProps<Props>(), {
  item: undefined,
  itemsGroup: undefined,
})

const getItemSaleReductionPrice = (item?: BasketItem) => {
  if (!item) return 0
  const itemTotalSalePrice = getBasketItemSalePrice(item)
  const totalWithReduction = price.value + (reducedPrice.value ?? 0)
  return sum([totalWithReduction, -itemTotalSalePrice])
}

const { formatCurrency } = useFormatHelpers()
const { hasSaleReduction, hasPromotionReduction, getBasketItemSalePrice } =
  useBasketReductions()
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
} = useBasketItem(mainItem)

const { $i18n } = useNuxtApp()
const wishlist = useWishlist()
const { trackRemoveFromWishlist, trackAddToWishlist } = useTrackingEvents()

const toast = useToast()

const { pageState } = usePageState()
const route = useRoute()

const isWishlistToggling = ref(false)
const index = toRef(props, 'index')

const { isFreeGift, giftBackgroundColorStyle } =
  useBasketItemPromotion(mainItem)

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
  toast.show(message, { action: 'ROUTE', to: routeList.wishlist })
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

  toast.show(message, { action: 'CONFIRM' })
}
</script>
