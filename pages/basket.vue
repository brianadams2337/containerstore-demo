<template>
  <div
    class="container max-sm:max-w-none sm:py-10"
    data-test-id="basket-container"
  >
    <ClientOnly>
      <div v-if="fetching || !basketData" class="grid grid-cols-12 gap-2">
        <ProductCardSkeleton
          v-for="index in 20"
          :key="`product-loading-${index}`"
        />
      </div>
      <div v-else-if="isBasketEmpty" class="space-y-8">
        <EmptyState
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
                <BasketAutomaticDiscountConditionBanner
                  v-if="
                    isAutomaticDiscountType(item.promotion) &&
                    item.isPromotionApplicableItemUnique
                  "
                  :basket-item="item"
                />
                <BasketGiftConditionBanner
                  v-if="isGiftApplicableItem(item)"
                  :basket-item="item"
                />
              </SFFadeInTransition>

              <SFSwipeDelete @delete="removeItem(item)">
                <BasketCard class="w-full" v-bind="{ item, index }" />
              </SFSwipeDelete>
              <SFFadeInTransition>
                <BasketItemPromotionGifts
                  v-if="isGiftApplicableItem(item)"
                  :basket-item="item"
                />
              </SFFadeInTransition>
            </template>
          </template>

          <div>
            <BasketCard
              v-for="(groupId, index) of Object.keys(orderedItems.groupedItems)"
              :key="`basket-group-${groupId}`"
              class="my-4"
              :items-group="orderedItems.groupedItems[groupId]"
              :index="index"
            />
          </div>
        </div>

        <BasketSummary class="w-full md:w-2/5 2xl:w-1/3" />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { defineOptions , onMounted , computed } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { useNuxtApp } from '#app/nuxt'
import { WishlistListingMetadata } from '~/constants/listingMetadata'
import { isBuyXGetYType , isAutomaticDiscountType } from '~/utils/promotion'
import { getPromotionIdFromProductAttributes } from '~/utils/product'
import { useBasketPromotions } from '~/composables/useBasketPromotions'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useBasketActions } from '~/composables/useBasketActions'
import { useRoute } from '#app/composables/router'
import { usePageState } from '~/composables/usePageState'
import { useWishlist , useBasket } from '#storefront/composables'
import {
  type BasketItem,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

const basket = await useBasket()
const wishlist = await useWishlist()

if (basket.error.value) {
  throw basket.error.value
}

const { pageState } = usePageState()
const route = useRoute()

const {
  listingMetaData,
  orderedItems,
  fetching,
  basketItems,
  basketData,
  basketCount,
  isBasketEmpty,
  removeItem,
} = await useBasketActions()

const {
  trackViewBasket,
  collectBasketItems,
  trackBasket,
  trackWishlist,
  collectProductListItems,
} = useTrackingEvents()

const { allCurrentPromotions } = await useBasketPromotions()

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
  if (promotionId || !isPromotionApplicableItemUnique) return false
  const id = getFirstAttributeValue(product?.attributes, 'promotion')?.id
  return allCurrentPromotions.value.some((promotion) => {
    const isFreeGift = isBuyXGetYType(promotion)
    if (!isFreeGift) return false
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
