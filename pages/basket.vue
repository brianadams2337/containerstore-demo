<template>
  <div
    class="container max-sm:max-w-none sm:py-10"
    data-testid="basket-container"
  >
    <SFAsyncDataWrapper :status="basketStatus">
      <div v-if="isBasketEmpty" class="space-y-8">
        <SFEmptyState
          :title="$t('basket.empty_title')"
          :description="$t('basket.empty_description')"
          show-default-actions
        />
      </div>
      <div v-else class="flex flex-col-reverse gap-8 md:flex-row xl:gap-16">
        <div class="w-full flex-1 space-y-4 md:w-3/5 2xl:w-2/3">
          <SFHeadline size="2xl" class="mb-6">
            {{ $t('basket.heading') }} ({{ basketCount }})
          </SFHeadline>

          <template v-if="orderedItems.standAlone">
            <template
              v-for="(item, index) in filteredOrderedItems"
              :key="item.key"
            >
              <SFFadeInTransition>
                <SFBasketAutomaticDiscountConditionBanner
                  v-if="
                    isAutomaticDiscountType(item.promotion) &&
                    item.isPromotionApplicableItemUnique
                  "
                  :basket-item="item"
                />
                <SFBasketGiftConditionBanner
                  v-if="isGiftApplicableItem(item)"
                  :basket-item="item"
                />
              </SFFadeInTransition>

              <SFSwipeDelete @delete="removeItem(item)">
                <SFBasketCard class="w-full" :item="item" :index="index" />
              </SFSwipeDelete>
              <SFFadeInTransition>
                <SFBasketItemPromotionGifts
                  v-if="isGiftApplicableItem(item)"
                  :basket-item="item"
                />
              </SFFadeInTransition>
            </template>
          </template>

          <div>
            <SFBasketCard
              v-for="(groupId, index) of Object.keys(orderedItems.groupedItems)"
              :key="`basket-group-${groupId}`"
              class="my-4"
              :items-group="orderedItems.groupedItems[groupId]"
              :index="index"
            />
          </div>
        </div>

        <SFBasketSummary class="w-full md:w-2/5 2xl:w-1/3" />
      </div>
      <template #loading>
        <div class="flex flex-col-reverse gap-8 md:flex-row xl:gap-16">
          <SFSkeletonLoader
            type="custom"
            class="h-96 w-full space-y-4 max-md:mb-4 md:w-3/5 2xl:w-2/3"
          />
          <SFSkeletonLoader
            type="custom"
            class="h-96 w-full md:w-2/5 2xl:w-1/3"
          />
        </div>
      </template>
    </SFAsyncDataWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import {
  type BasketItem,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'
import { definePageMeta } from '#imports'
import { useNuxtApp } from '#app'
import { useRoute } from '#app/composables/router'
import { WishlistListingMetadata } from '~/constants/listingMetadata'
import { isAutomaticDiscountType, isBuyXGetYType } from '~/utils/promotion'
import { getPromotionIdFromProductAttributes } from '~/utils/product'
import {
  useBasketActions,
  useBasketPromotions,
  usePageState,
  useTrackingEvents,
} from '~/composables'
import { useBasket, useWishlist } from '#storefront/composables'
import {
  SFHeadline,
  SFFadeInTransition,
  SFSkeletonLoader,
  SFSwipeDelete,
} from '#storefront-ui/components'
import SFAsyncDataWrapper from '~/components/SFAsyncDataWrapper.vue'
import SFBasketAutomaticDiscountConditionBanner from '~/components/basket/promotion/SFBasketAutomaticDiscountConditionBanner.vue'
import SFBasketGiftConditionBanner from '~/components/basket/promotion/SFBasketGiftConditionBanner.vue'
import SFBasketCard from '~/components/basket/card/SFBasketCard.vue'
import SFBasketItemPromotionGifts from '~/components/basket/promotion/SFBasketItemPromotionGifts.vue'
import SFBasketSummary from '~/components/basket/summary/SFBasketSummary.vue'
import SFEmptyState from '~/components/SFEmptyState.vue'

const basket = useBasket()
const wishlist = useWishlist()

const { pageState } = usePageState()
const route = useRoute()

const {
  listingMetaData,
  orderedItems,
  basketStatus,
  basketItems,
  basketCount,
  isBasketEmpty,
  removeItem,
} = useBasketActions()

const {
  trackViewBasket,
  collectBasketItems,
  trackBasket,
  trackWishlist,
  collectProductListItems,
} = useTrackingEvents()

const { allCurrentPromotions } = useBasketPromotions()

type FilteredOrderedItem = BasketItem & {
  isPromotionApplicableItemUnique: boolean
}

const isPromotionApplicableItemUnique = (
  item: BasketItem,
  items: BasketItem[],
) => {
  return !items.some((basketItem) => {
    const basketProductPromotionId = getPromotionIdFromProductAttributes(
      basketItem.product,
    )
    return (
      basketProductPromotionId ===
      basketItemPromotion(item)?.customData.product?.promotionId
    )
  })
}

const filteredOrderedItems = computed(() => {
  return orderedItems.value.standAlone.reduce<FilteredOrderedItem[]>(
    (previous, current) => {
      previous.push({
        ...current,
        isPromotionApplicableItemUnique: isPromotionApplicableItemUnique(
          current,
          previous,
        ),
      })
      return previous
    },
    [],
  )
})

const basketItemPromotion = (item: BasketItem) => {
  const currentBasketItemProductId = getPromotionIdFromProductAttributes(
    item.product,
  )

  return allCurrentPromotions.value.find(({ customData }) => {
    return customData?.product?.promotionId === currentBasketItemProductId
  })
}

const isGiftApplicableItem = ({
  product,
  promotionId,
  isPromotionApplicableItemUnique,
}: FilteredOrderedItem) => {
  if (promotionId || !isPromotionApplicableItemUnique) {
    return false
  }
  const id = getFirstAttributeValue(product?.attributes, 'promotion')?.id
  return allCurrentPromotions.value.some((promotion) => {
    const isFreeGift = isBuyXGetYType(promotion)
    if (!isFreeGift) {
      return false
    }
    return promotion.customData?.product?.promotionId === id
  })
}

onMounted(() => {
  if (basketItems.value) {
    trackViewBasket(
      collectBasketItems(basket.items.value || [], {
        listId: listingMetaData.id,
        listName: listingMetaData.name,
      }),
      {
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: route.params.id?.toString() || '',
      },
      basket.cost.value,
    )
    trackBasket(
      collectBasketItems(basket.items.value || [], {
        listId: listingMetaData.id,
        listName: listingMetaData.name,
      }),
    )
    trackWishlist(
      collectProductListItems(wishlist.products.value, {
        listId: WishlistListingMetadata.ID,
        listName: WishlistListingMetadata.NAME,
      }),
    )
  }
})

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t('navigation.basket'),
  robots: 'noindex,follow',
})

defineOptions({ name: 'BasketPage' })
definePageMeta({ pageType: 'basket_page' })
</script>
