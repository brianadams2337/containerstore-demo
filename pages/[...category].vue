<template>
  <CMSCategoryData :selected-category="selectedCategory?.id">
    <template
      #default="{
        content,
        hasTeaserImage,
        postListingContent,
        preListingContent,
      }"
    >
      <div v-if="hasTeaserImage">
        <CMSImage :blok="content" is-teaser />
      </div>
      <PageContent v-if="products?.length === 0">
        <SFHeadline class="!block" size="xl">
          {{ $t('plp.no_results') }}
        </SFHeadline>
        <SFHeadline size="sm" class="mt-4 !block text-gray-700">
          {{ $t('plp.no_products') }}
        </SFHeadline>
      </PageContent>
      <PageContent v-else class="sm:flex">
        <div class="-ml-4 hidden w-1/3 md:block md:w-2/5 lg:w-3/12">
          <SideNavigation
            v-if="categories && 'children' in categories && categories.children"
            :categories="categories.children"
            :fetching="categoriesFetching"
            :root-category="categories"
            show-nested-categories
          />
        </div>
        <div class="w-full">
          <template v-if="preListingContent && isFirstPage">
            <component
              :is="preContent.component"
              v-for="preContent in preListingContent"
              :key="preContent._uid"
              :blok="preContent"
            />
          </template>

          <div
            class="flex flex-col items-start justify-between overflow-x-hidden"
          >
            <ProductListBreadcrumbs />
            <div
              class="mt-2 flex w-full flex-col justify-between space-y-2 md:flex-row"
            >
              <ProductQuickFilters />
              <div class="order-1 flex items-center space-x-4 text-sm">
                <SortingMenu
                  :selected="selectedSort.name"
                  :values="sortingValues"
                />
                <SFButton
                  data-test-id="filter-toggle-button"
                  type="tertiary"
                  size="sm"
                  @click="toggleFilter"
                >
                  <template #icon="{ _class }">
                    <IconFilter :class="_class" />
                  </template>
                  {{ $t('plp.filter') }}
                </SFButton>
              </div>
            </div>
          </div>
          <ProductList
            :loading="productsFetching"
            :products="products"
            :refreshing="productsFetching"
            class="mt-8 grid w-auto grid-cols-12 gap-1"
            @click:product="trackProductClick"
            @intersect:row="trackViewListing"
          />
          <SFPagination
            v-if="pagination"
            class="mt-16"
            :current-page="pagination.page"
            :first-page="pagination.first"
            :last-page="pagination.last"
          />

          <template v-if="postListingContent && isFirstPage">
            <component
              :is="preContent.component"
              v-for="preContent in postListingContent"
              :key="preContent._uid"
              :blok="preContent"
            />
          </template>
        </div>
        <FilterSlideIn v-if="filters && products" />
      </PageContent>
    </template>
  </CMSCategoryData>
</template>

<script setup lang="ts">
import { HttpStatusCode, type Product } from '@scayle/storefront-nuxt'
import type { FilterContext } from '~/composables/useFilterContext'

const route = useRoute()
const { pageState, setPageState } = usePageState()
const { $i18n, $config } = useNuxtApp()
const { toggle: toggleFilter } = useSlideIn('FilterSlideIn')
const { trackViewItemList, trackSelectItem } = useTrackingEvents()
const { category, fetch: fetchCategory } = await useCategory()

await fetchCategory()

if (!category.value) {
  throw createError({ statusCode: HttpStatusCode.NOT_FOUND, fatal: true })
}

const categoryPath = computed(() => category.value?.path ?? '')

const {
  products,
  productsFetching,
  filterStatus,
  categoriesFetching,
  categories,
  selectedCategory,
  fetchProducts,
  pagination,
  filters,
  productError,
  filterError,
  categoriesError,
  filtersFetching,
  productCountData,
  refreshProductCount,
  unfilteredCount,
} = await useFacet({
  key: `useFacet-${categoryPath.value}`,
  params: FACET_PARAMS,
})

const { selectedSort, sortingValues } = useProductListSort(selectedCategory)

const { productConditions } = useQueryFilterState({
  defaultSort: DEFAULT_SORTING_KEY,
})

const fetchParameters = computed(() => ({
  path: categoryPath.value,
  perPage: PRODUCTS_PER_PAGE,
  ...productConditions.value,
  where: {
    ...productConditions.value.where,
    term: String(route.query.term || ''),
  },
  cache: {
    ttl: FETCH_PRODUCTS_CACHE_TTL,
    cacheKeyPrefix: `PLP:${categoryPath.value}`,
  },
  sort: {
    ...selectedSort.value,
  },
}))

await fetchProducts(fetchParameters.value)

const filterContext: FilterContext = {
  filterableValues: filters,
  filtersFetching,
  filterStatus,
  productCountData,
  refreshProductCount,
  unfilteredCount,
}

createFilterContext(filterContext)

const { isFiltered, resetFilters, applyFilters } = useFilter(filterContext)

const trackViewListing = ({ items }: { row: number; items: Product[] }) => {
  const paginationOffset = ((pagination.value?.page || 1) - 1) * 24
  trackViewItemList({
    items,
    listingMetaData: categoryListingMetaData,
    paginationOffset,
    source: `category|${selectedCategory.value?.id}`,
  })
}

const error = computed(() => {
  return productError.value || filterError.value || categoriesError.value
})

if (error.value) {
  throw error.value
}

watch(
  () => route.query,
  async () => await fetchProducts(fetchParameters.value),
)

const trackProductClick = (product: Product) => {
  trackSelectItem({
    product,
    listingMetaData: categoryListingMetaData,
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: route.params.id?.toString() || '',
    },
  })
}

const isFirstPage = computed(() => pagination.value?.page === 1)

watch(
  () => route.path,
  async () => {
    resetFilters()
    await applyFilters({ shouldToggle: false })
    await fetchProducts(fetchParameters.value)
  },
  { immediate: false },
)

watch(
  () => selectedCategory.value?.id,
  (id) => id && setPageState('typeId', String(id)),
  { immediate: true },
)

const robots = computed(() =>
  isFiltered.value ? 'noindex,follow' : 'index,follow',
)
const metaDescription = computed(() => {
  return $i18n.t('plp.seo_description', {
    categoryName: selectedCategory.value?.name.toLowerCase(),
  })
})

useHead(() => ({
  robots: robots.value,
  title: selectedCategory.value?.name,
  meta: [{ name: 'description', content: metaDescription.value }],
  link: robots.value?.includes('noindex')
    ? []
    : [
        {
          rel: 'canonical',
          key: 'canonical',
          href: prepareCanonicalURL(
            `${$config.public.baseUrl}${route?.fullPath}`,
          ),
        },
      ],
}))

defineOptions({ name: 'ProductListPage' })
definePageMeta({ pageType: 'category_page' })
</script>
