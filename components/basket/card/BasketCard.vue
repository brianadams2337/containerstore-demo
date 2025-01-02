<template>
  <SFFadeInTransition>
    <div
      v-if="uiState === 'default'"
      data-testid="basket-card"
      class="w-full rounded border border-gray-350 p-4 text-sm lg:p-5"
    >
      <div class="flex w-full" :class="{ 'opacity-50': !inStock }">
        <div
          class="relative flex w-28 shrink-0 items-center pr-3 lg:w-48 lg:p-0 lg:pr-6"
          @click.capture="selectItem"
          @keydown.enter="selectItem"
        >
          <LocalizedLink
            :to="getProductDetailRoute(product.id, name)"
            class="grid h-full grid-cols-1 grid-rows-1 rounded-md bg-gray-200 p-2"
          >
            <ProductImage
              v-if="image"
              :image="image"
              :alt="alt"
              fit="cover"
              sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
              class="col-start-1 col-end-1 row-start-1 row-end-1"
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
          </LocalizedLink>
        </div>
        <div
          class="flex flex-1 flex-col justify-center gap-2 overflow-hidden !p-1 lg:flex-row lg:gap-0 lg:p-0"
        >
          <div class="flex grow flex-col justify-between gap-2 lg:pt-4">
            <div>
              <LocalizedLink
                :to="getProductDetailRoute(product.id, name)"
                class="block !whitespace-normal"
                @click.capture="selectItem"
                @keydown.enter="selectItem"
              >
                <BasketCardDetail
                  v-if="brand && name"
                  :label="brand"
                  :value="name"
                  primary
                  data-testid="basket-product-brand"
                />
              </LocalizedLink>
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
              data-testid="basket-card-prices"
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
                    class="p-1 text-xs leading-5 text-secondary line-through"
                    data-testid="basket-card-original-price"
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
                    data-testid="basket-card-price-sale"
                  >
                    {{ formatCurrency(getItemSaleReductionPrice(item)) }}
                  </span>
                  <span
                    v-else-if="hasCampaignReduction(item)"
                    class="p-1 text-base leading-5 text-red"
                    :class="{
                      'text-xs leading-[1.125rem] text-secondary line-through':
                        hasPromotionReduction(item),
                    }"
                    data-testid="basket-card-price-campaign"
                  >
                    {{ formatCurrency(getItemCampaignReductionPrice(item)) }}
                  </span>
                </div>
                <span
                  v-if="hasPromotionReduction(item)"
                  class="inline rounded p-1 text-base leading-5"
                  data-testid="basket-card-reduction-price"
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
              <span
                v-else
                class="text-base leading-5"
                data-testid="basket-card-product-price"
              >
                {{ formatCurrency(price) }}
              </span>
              <p
                v-if="
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
        <WishlistToggle
          :product="item.product"
          :listing-meta-data="listingMetaData"
        />

        <BasketCardAction
          data-testid="basket-remove-item-button"
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
import { computed, toRef } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import AddOnItems from '../addOns/AddOnItems.vue'
import BasketCardDetail from './BasketCardDetail.vue'
import BasketCardConfirmDelete from './BasketCardConfirmDelete.vue'
import BasketCardAction from './BasketCardAction.vue'
import ProductPromotionFreeGiftBadge from '~/components/product/promotion/gifts/ProductPromotionFreeGiftBadge.vue'
import { useFormatHelpers } from '#storefront/composables'
import WishlistToggle from '~/components/product/WishlistToggle.vue'
import {
  useBasketItem,
  useBasketItemPromotion,
  useBasketReductions,
  useProductBaseInfo,
  useRouteHelpers,
} from '~/composables'
import { getBackgroundColorStyle, getTextColorStyle } from '~/utils'
import { AlphaColorMap } from '~/constants'
import { SFFadeInTransition, SFDropdown } from '#storefront-ui/components'
import LocalizedLink from '~/components/LocalizedLink.vue'
import ProductImage from '~/components/product/ProductImage.vue'
import ProductCardBadgesFooter from '~/components/product/card/badges/ProductCardBadgesFooter.vue'

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
  if (!item) {
    return 0
  }

  const itemTotalSalePrice = getBasketItemPrice(item, 'sale')
  const totalWithReduction = price.value + (reducedPrice.value ?? 0)

  return totalWithReduction + -itemTotalSalePrice
}

const getItemCampaignReductionPrice = (item?: BasketItem) => {
  if (!item) {
    return 0
  }

  const itemTotalSalePrice = getBasketItemPrice(item, 'campaign')
  const totalWithReduction = price.value + (reducedPrice.value ?? 0)

  return totalWithReduction + -itemTotalSalePrice
}

const { formatCurrency } = useFormatHelpers()
const {
  hasSaleReduction,
  hasPromotionReduction,
  getBasketItemPrice,
  hasCampaignReduction,
} = useBasketReductions()
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
  changeQuantity,
  price,
  availableQuantity,
  onPressDelete,
  quantity,
  lowestPriorPrice,
  reducedPrice,
  product,
  selectItem,
  listingMetaData,
} = useBasketItem(mainItem)

const { alt } = useProductBaseInfo(product)

const index = toRef(props, 'index')

const { isFreeGift, giftBackgroundColorStyle } =
  useBasketItemPromotion(mainItem)

const addOnItems = computed(() =>
  props.itemsGroup
    ? props.itemsGroup.filter((item) => !item.itemGroup?.isMainItem)
    : [],
)
</script>
