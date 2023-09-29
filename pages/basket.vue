<template>
  <div class="container sm:py-10" data-test-id="basket-container">
    <div v-if="fetching || !basketData" class="grid grid-cols-12 gap-2">
      <ProductCardSkeleton
        v-for="index in 20"
        :key="`product-loading-${index}`" />
    </div>
    <div v-else-if="basketCount === 0" class="space-y-8">
      <div>
        <EmptyState
          :title="$t('basket.empty_title')"
          :description="$t('basket.empty_description')">
          <div class="mt-8 flex justify-center gap-4 md:justify-start">
            <AppButton type="primary" :to="{ name: routeList.signin.name }">
              {{ $t('basket.sign_in_label') }}
            </AppButton>
            <AppButton :to="{ name: routeList.home.name }" type="tertiary">
              {{ $t('basket.continue_shopping_label') }}
            </AppButton>
          </div>
        </EmptyState>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col-reverse gap-8 md:flex-row xl:gap-32 2xl:gap-64">
      <div class="flex-1 space-y-4">
        <Headline size="2xl" class="mb-6" :is-uppercase="false">
          {{ $t('basket.heading') }} ({{ basketCount }})
        </Headline>
        <template v-if="orderedItems.standAlone">
          <SwipeDelete
            v-for="(item, index) in orderedItems.standAlone"
            :key="item.key"
            @delete="removeItem(item)">
            <BasketCard
              data-test-id="basket-card"
              class="w-full"
              :item="item"
              :index="index"
              @item:remove="removeItem(item)"
              @item:select="trackProductClick(item)" />
          </SwipeDelete>
        </template>

        <div>
          <BasketCard
            v-for="(groupId, index) of Object.keys(orderedItems.groupedItems)"
            :key="`basket-group-${groupId}`"
            class="my-4"
            :items-group="orderedItems.groupedItems[groupId]"
            :index="index"
            @item:remove="removeItem"
            @item:select="trackProductClick" />
        </div>
      </div>

      <BasketSummary />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BasketItem,
  getFirstAttributeValue,
  Product,
} from '@scayle/storefront-nuxt'
import { BasketListingMetadata, WishlistListingMetadata } from '~/constants'
// import { metaTagGenerator } from '~/helpers/seo'

const basket = await useBasket({ options: { autoFetch: true, lazy: true } })
const wishlist = await useWishlist({ options: { autoFetch: true, lazy: true } })

if (basket.error.value) {
  throw createError(basket.error.value)
}

const store = useStore()
const route = useRoute()

const listingMetaData = {
  id: BasketListingMetadata.ID,
  name: BasketListingMetadata.NAME,
}
const {
  trackViewBasket,
  trackRemoveFromBasket,
  collectBasketItems,
  trackSelectItem,
  trackBasket,
  trackWishlist,
  collectProductListItems,
} = useTrackingEvents()

const { bundleByGroup } = await useBasketGroup()

onMounted(() => {
  if (basket.items.value) {
    trackViewBasket(
      collectBasketItems(basket.items.value || [], {
        listId: listingMetaData.id,
        listName: listingMetaData.name,
      }),
      {
        content_name: route.fullPath,
        page_type: store.value.pageType,
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

// const metaTags = metaTagGenerator({
//   robots: 'noindex,follow',
// })

// useMeta(() => ({ title: `Basket`, ...metaTags }))

const trackProductClick = ({ product }: { product: Product }) => {
  trackSelectItem({
    product,
    listingMetaData,
    pagePayload: {
      content_name: route.fullPath,
      page_type: store.value.pageType,
      page_type_id: route.params.id?.toString() || '',
    },
  })
}

const removeItem = async (item: BasketItem) => {
  await basket.removeItem({ variantId: item.variant.id })

  trackRemoveFromBasket(item.product, item.quantity, item.variant)
  trackBasket(
    collectBasketItems(basket.items.value || [], {
      listId: listingMetaData.id,
      listName: listingMetaData.name,
    }),
  )
}

// Remove this to use bapi default: order by updated quantity
const orderedItems = computed(() => {
  const items = basket.items.value || []
  const standAlone: BasketItem[] = []
  const itemsWithGroups: BasketItem[] = []

  items.forEach((item: BasketItem) =>
    item.itemGroup?.id ? itemsWithGroups.push(item) : standAlone.push(item),
  )

  return {
    standAlone: sortBasketItems(standAlone),
    groupedItems: bundleByGroup(sortBasketItems(itemsWithGroups)),
  }
})

const sortBasketItems = (items: BasketItem[]) => {
  const sortedAlphabetically = useAlphabetical(
    items,
    (item: BasketItem) =>
      getFirstAttributeValue(item.product.attributes, 'name')?.label ?? '',
  )
  return useSort(
    sortedAlphabetically,
    (item: BasketItem) =>
      getFirstAttributeValue(item.variant?.attributes, 'size')?.id ?? 0,
  )
}

const fetching = basket.fetching
const basketData = basket.data
const basketCount = basket.count

const { $i18n } = useNuxtApp()
useSeoMeta({
  title: $i18n.t('navigation.basket'),
  robots: 'noindex,follow',
})

definePageMeta({ pageType: 'basket_page' })
</script>

<script lang="ts">
export default {
  name: 'BasketPage',
}
</script>
