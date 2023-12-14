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
        <AppButton type="tertiary" size="sm" @click="toggleFilter">
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
    <FilterSlideIn v-if="filters?.length" />
  </PageContent>
</template>

<script setup lang="ts">
import {
  getFirstAttributeValue,
  getSortByValue,
  type Product,
  getSortingValues,
} from '@scayle/storefront-nuxt'

const route = useRoute()

const { $i18n, $alert } = useNuxtApp()
const { pageState } = usePageState()
const term = computed(() => route.query.term || '')
const { toggle: toggleFilter } = useSlideIn('FilterSlideIn')

const wishlist = await useWishlist()

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

const { applyFilters: _applyFilter, productConditions } = useQueryFilterState()

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
    !wasInWishlist ? localePath(routeList.wishlist) : undefined,
  )
}

const sortingValues = Object.values(getSortingValues())
const selectedSort = computed(() => getSortByValue(route.query.sort || '').name)

const resultsCount = computed(() => pagination.value?.total)

defineOptions({ name: 'SearchPage' })
definePageMeta({ pageType: 'search_result_page' })
</script>
