<template>
  <div
    class="container max-sm:max-w-none sm:py-10"
    data-test-id="basket-container"
  >
    <div v-if="fetching || !basketData" class="grid grid-cols-12 gap-2">
      <ProductCardSkeleton
        v-for="index in 20"
        :key="`product-loading-${index}`"
      />
    </div>
    <div v-else-if="isBasketEmpty" class="space-y-8">
      <div>
        <EmptyState
          :title="$t('basket.empty_title')"
          :description="$t('basket.empty_description')"
          show-default-actions
        />
      </div>
    </div>
    <div v-else class="flex flex-col-reverse gap-8 md:flex-row xl:gap-16">
      <div class="w-full flex-1 space-y-4 md:w-3/5 2xl:w-2/3">
        <Headline size="2xl" class="mb-6">
          {{ $t('basket.heading') }} ({{ basketCount }})
        </Headline>

        <template v-if="orderedItems.standAlone">
          <template
            v-for="(item, index) in orderedItems.standAlone"
            :key="item.key"
          >
            <FadeInTransition>
              <BasketAutomaticDiscountBanner
                v-if="isAutomaticDiscountType(item.promotion)"
                :basket-item="item"
              />
              <BasketGiftConditionBanner
                v-if="isGiftApplicableItem(item)"
                :basket-item="item"
              />
            </FadeInTransition>

            <SwipeDelete @delete="removeItem(item)">
              <BasketCard class="w-full" v-bind="{ item, index }" />
            </SwipeDelete>
            <FadeInTransition>
              <BasketItemPromotionGifts
                v-if="isGiftApplicableItem(item)"
                :basket-item="item"
              />
            </FadeInTransition>
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
  </div>
</template>

<script setup lang="ts">
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

const isGiftApplicableItem = ({ product, promotionId }: BasketItem) => {
  if (promotionId) {
    return false
  }
  const id = getFirstAttributeValue(product?.attributes, 'promotion')?.id
  return allCurrentPromotions.value.some((promotion) => {
    const isFreeGift = isBuyXGetYType(promotion)
    return isFreeGift && promotion.customData?.product?.promotionId === id
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
