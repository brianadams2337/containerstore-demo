<template>
  <PageContent>
    <div class="flex w-full justify-between">
      <Headline>{{ $t('search.result', { term, resultsCount }) }}</Headline>
      <div
        v-if="filters?.length"
        class="order-1 flex items-center space-x-4 text-sm">
        <section>
          <SortingMenu :selected="selectedSort" :values="sortingValues" />
        </section>
        <AppButton type="tertiary" @click="toggleFilter">
          {{ $t('plp.filter') }}
          <template #icon="{ _class }">
            <IconFilter :class="_class" />
          </template>
        </AppButton>
      </div>
    </div>
    <ProductList
      :loading="productsPending"
      :per-page="PRODUCTS_PER_PAGE"
      :products="products"
      :refreshing="productsPending"
      class="mt-8 grid w-auto grid-cols-12 gap-2"
      @click:toggle-product-wishlist="toggleItem($event)" />
    <NuxtLazyHydrate>
      <Pagination
        v-if="pagination"
        :current-page="pagination.page"
        :first-page="pagination.first"
        :last-page="pagination.last" />
    </NuxtLazyHydrate>
    <FilterSlideIn
      v-if="filters?.length"
      :active-filters="activeFilters"
      :filters="filters"
      :is-active-filter="isActiveFilter"
      :filtered-count="filteredCount"
      :unfiltered-count="unfilteredCount"
      :fetching-filtered-count="productCountPending"
      @filter:apply="applyFilter($event)"
      @filter:state-changed="updateFilterCount($event)" />
  </PageContent>
</template>

<script setup lang="ts">
import {
  getFirstAttributeValue,
  getSortByValue,
  Product,
  getSortingValues,
  transformToWhereCondition,
} from '@scayle/storefront-nuxt'
import { Action } from '~/constants/toast'

const PRODUCTS_PER_PAGE = 24
const route = useRoute()
const localePath = useLocalePath()
const { $i18n, $alert } = useNuxtApp()
const term = computed(() => (route.query.value as any)?.term || '')
const { toggle: toggleFilter } = useSlideIn('FilterSlideIn')

// const wishlist = useWishlist()
// TODO: Remove mock after the wishlist implementation (with generated key for session)
const wishlist = {
  findItem: ({ productId }: { productId: number }) => ({ productId }),
  toggleItem: ({ productId }: { productId: number }) => ({ productId }),
}
// const { trackFilterApply, trackAddToWishlist, trackRemoveFromWishlist } =
//   useTrackingEvents()

const {
  products,
  productsPending,
  pagination,
  filters,
  fetchProducts,
  productCountData,
  productCountPending,
  refreshProductCount,
  unfilteredCount,
} = await useFacet('useSearchFacet', {
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
})

const {
  applyFilters: _applyFilter,
  activeFilters,
  isActiveFilter,
  productConditions,
} = useQueryFilterState()

await fetchProducts({
  // TODO: get current slug women,men,kids
  path: '/',
  ...productConditions.value,
  perPage: PRODUCTS_PER_PAGE,
  where: {
    ...productConditions.value.where,
    term: term.value.toString(),
  },
  sort: {},
})

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
    {
      productName: name,
    },
  )

  // wasInWishlist
  //   ? trackRemoveFromWishlist({
  //       product,
  //       pagePayload: {
  //         content_name: route.value.fullPath,
  //         page_type: store.state.pageType,
  //         page_type_id: route.params.value.id?.toString() || '',
  //       },
  //     })
  //   : trackAddToWishlist({
  //       product,
  //       pagePayload: {
  //         content_name: route.value.fullPath,
  //         page_type: store.state.pageType,
  //         page_type_id: route.params.value.id?.toString() || '',
  //       },
  //     })

  const action = !wasInWishlist ? Action.ROUTE : Action.CONFIRM
  $alert.show(
    message,
    action,
    !wasInWishlist ? localePath(routeList.wishlist) : undefined,
  )
}

const applyFilter = (filter: Record<string, any>) => {
  // if (!isEmpty(filter)) {
  //   Object.keys(filter).forEach((key: string) => {
  //     const values = Array.isArray(filter[key])
  //       ? filter[key].join('|')
  //       : filter[key]
  //     // trackFilterApply(key, values)
  //   })
  // }

  _applyFilter(filter)
}

const updateFilterCount = async (filter: Record<string, any>) => {
  await refreshProductCount({
    category: '/',
    where: {
      ...transformToWhereCondition(filter),
      term: term.value.toString(),
    },
  })
}

const sortingValues = Object.values(getSortingValues())
const selectedSort = computed(() => {
  return getSortByValue((route.query.value as any)?.sort || '').name
})

const resultsCount = computed(() => pagination.value?.total)
const filteredCount = computed(() => productCountData.value?.count ?? 0)
</script>

<script lang="ts">
export default {
  name: 'SearchPage',
  meta: {
    pageType: 'search_result_page',
  },
}
</script>
