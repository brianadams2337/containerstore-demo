<template>
  <PageContent>
    <div class="flex w-full justify-between">
      <SFHeadline is-uppercase>
        {{ $t('search.result', { term, resultsCount }) }}
      </SFHeadline>
      <div
        v-if="filters?.length"
        class="order-1 flex items-center space-x-4 text-sm"
      >
        <section>
          <SortingMenu :selected="selectedSort" :values="sortingValues" />
        </section>
        <SFButton type="tertiary" size="sm" @click="toggleFilter">
          {{ $t('plp.filter') }}
          <template #icon="{ _class }">
            <IconFilter :class="_class" />
          </template>
        </SFButton>
      </div>
    </div>
    <ProductList
      :loading="productsFetching"
      :per-page="PRODUCTS_PER_PAGE"
      :products="products"
      :refreshing="productsFetching"
      class="mt-8 grid w-auto grid-cols-12 gap-2"
      @click:toggle-product-wishlist="toggleItem($event)"
    />
    <SFPagination
      v-if="pagination"
      :current-page="pagination.page"
      :first-page="pagination.first"
      :last-page="pagination.last"
    />
    <FilterSlideIn v-if="filters?.length" />
  </PageContent>
</template>

<script setup lang="ts">
import { computed, defineOptions, watch } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import {
  type Product,
  getFirstAttributeValue,
  getSortByValue,
  getSortingValues,
} from '@scayle/storefront-nuxt'
import { definePageMeta } from '#imports'
import { routeList } from '~/utils/route'
import { useLocalePath } from '#i18n'
import { fetchLazy } from '~/utils/loading'
import {
  useFacet,
  useQueryFilterState,
  useWishlist,
} from '#storefront/composables'
import { useSlideIn } from '~/modules/ui/runtime/composables/useSlideIn'
import {
  createFilterContext,
  usePageState,
  useToast,
  useTrackingEvents,
} from '~/composables'
import { useNuxtApp } from '#app/nuxt'
import { useRoute } from '#app/composables/router'
import { PRODUCTS_PER_PAGE } from '~/constants/product'

const route = useRoute()

const { $i18n } = useNuxtApp()
const { pageState } = usePageState()
const term = computed(() => route.query.term || '')
const { toggle: toggleFilter } = useSlideIn('FilterSlideIn')

const wishlist = await useWishlist()

const toast = useToast()

const { trackAddToWishlist, trackRemoveFromWishlist } = useTrackingEvents()

const {
  products,
  productsFetching,
  pagination,
  filters,
  filtersFetching,
  filterStatus,
  fetchProducts,
  productCountData,
  refreshProductCount,
  unfilteredCount,
} = await useFacet({
  key: 'useSearchFacet',
  params: {
    with: {
      product: {
        attributes: {
          withKey: ['color', 'brand', 'name'],
        },
        variants: {
          attributes: {
            withKey: ['price', 'size'],
          },
          lowestPriorPrice: true,
        },
        images: {
          attributes: {
            withKey: ['imageType', 'imageView', 'imageBackground', 'imageKind'],
          },
        },
        siblings: {
          images: {
            attributes: {
              withKey: ['imageType', 'imageView', 'imageBackground'],
            },
          },
          attributes: {
            withKey: ['color', 'name', 'brand'],
          },
        },
        priceRange: true,
        lowestPriorPrice: true,
      },
    },
  },
})

createFilterContext({
  filterableValues: filters,
  filtersFetching,
  filterStatus,
  productCountData,
  refreshProductCount,
  unfilteredCount,
})

const { productConditions } = useQueryFilterState()

await fetchLazy(
  fetchProducts({
    // TODO: get current slug women,men,kids
    path: '/',
    ...productConditions.value,
    perPage: PRODUCTS_PER_PAGE,
    where: {
      ...productConditions.value.where,
      term: term.value.toString(),
    },
    sort: {},
  }),
)

watch(
  () => route.query,
  async () => {
    await fetchProducts({
      path: '/',
      ...productConditions.value,
      where: {
        ...productConditions.value.where,
        term: term.value.toString(),
      },
    })
  },
)
const localePath = useLocalePath()

const toggleItem = (product: Product) => {
  const wasInWishlist = !!wishlist.findItem({ productId: product.id })

  const name =
    getFirstAttributeValue(product.attributes, 'name')?.label ||
    $i18n.t('wishlist.product')

  wishlist.toggleItem({ productId: product.id })

  const message = $i18n.t(
    `wishlist.notification.${
      !wasInWishlist ? 'add_to_wishlist' : 'remove_from_wishlist'
    }`,
    { productName: name },
  )

  wasInWishlist
    ? trackRemoveFromWishlist({
        product,
        pagePayload: {
          content_name: route.fullPath,
          page_type: pageState.value.type,
          page_type_id: route.params.id?.toString() || '',
        },
      })
    : trackAddToWishlist({
        product,
        pagePayload: {
          content_name: route.fullPath,
          page_type: pageState.value.type,
          page_type_id: route.params.id?.toString() || '',
        },
      })

  const action = !wasInWishlist ? 'ROUTE' : 'CONFIRM'
  toast.show(message, action, {
    to: !wasInWishlist ? localePath(routeList.wishlist) : undefined,
  })
}

const sortingValues = Object.values(getSortingValues())
const selectedSort = computed(() => getSortByValue(route.query.sort || '').name)

const resultsCount = computed(() => pagination.value?.total)
const title = computed(() => {
  return `${$i18n.t('search.seo_title', {
    term: term.value.toString(),
    count: resultsCount.value?.toString(),
  })}`
})

useSeoMeta({
  robots: 'index,follow',
  title,
})

defineOptions({ name: 'SearchPage' })
definePageMeta({ pageType: 'search_result_page' })
</script>
