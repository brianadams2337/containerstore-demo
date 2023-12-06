<template>
  <PageContent>
    <div class="flex w-full justify-between">
      <Headline is-uppercase>
        {{ $t('search.result', { term, resultsCount }) }}
      </Headline>
      <div
        v-if="filters?.length"
        class="order-1 flex items-center space-x-4 text-sm"
      >
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
      :loading="productsFetching"
      :per-page="PRODUCTS_PER_PAGE"
      :products="products"
      :refreshing="productsFetching"
      class="mt-8 grid w-auto grid-cols-12 gap-2"
      @click:toggle-product-wishlist="toggleItem($event)"
    />
    <Pagination
      v-if="pagination"
      :current-page="pagination.page"
      :first-page="pagination.first"
      :last-page="pagination.last"
    />
    <FilterSlideIn
      v-if="filters?.length"
      v-bind="{
        activeFilters,
        filters,
        isActiveFilter,
        filteredCount,
        unfilteredCount,
      }"
      :fetching-filtered-count="productCountFetching"
      @filter:apply="applyFilter($event)"
      @filter:state-changed="updateFilterCount($event)"
    />
  </PageContent>
</template>

<script setup lang="ts">
import {
  getFirstAttributeValue,
  getSortByValue,
  type Product,
  getSortingValues,
  transformToWhereCondition,
} from '@scayle/storefront-nuxt'

const PRODUCTS_PER_PAGE = 24

const route = useRoute()

const { $i18n, $alert } = useNuxtApp()
const { pageState } = usePageState()
const term = computed(() => route.query.term || '')
const { toggle: toggleFilter } = useSlideIn('FilterSlideIn')

const wishlist = await useWishlist()

const { trackFilterApply, trackAddToWishlist, trackRemoveFromWishlist } =
  useTrackingEvents()

const {
  products,
  productsFetching,
  pagination,
  filters,
  fetchProducts,
  productCountData,
  productCountFetching,
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

const {
  applyFilters: _applyFilter,
  activeFilters,
  isActiveFilter,
  productConditions,
} = useQueryFilterState()

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
  $alert.show(
    message,
    action,
    !wasInWishlist ? toLocalePath(routeList.wishlist) : undefined,
  )
}

const applyFilter = (filter: Record<string, any>) => {
  if (!isEmpty(filter)) {
    Object.keys(filter).forEach((key: string) => {
      const values = Array.isArray(filter[key])
        ? filter[key].join('|')
        : filter[key]
      trackFilterApply(key, values)
    })
  }

  _applyFilter(filter)
}

const updateFilterCount = async (filter: Record<string, any>) => {
  await refreshProductCount({
    where: {
      ...transformToWhereCondition(filter),
      term: term.value.toString(),
    },
  })
}

const sortingValues = Object.values(getSortingValues())
const selectedSort = computed(() => getSortByValue(route.query.sort || '').name)

const resultsCount = computed(() => pagination.value?.total)
const filteredCount = computed(() => productCountData.value?.count ?? 0)

defineOptions({ name: 'SearchPage' })
definePageMeta({ pageType: 'search_result_page' })
</script>
