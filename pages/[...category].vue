<template>
  <div>
    <div v-if="hasTeaserImage">
      <CmsImage :blok="cmsContent" is-teaser />
    </div>
    <PageContent>
      <div class="sm:flex">
        <div v-if="isGreaterOrEquals('md')" class="-ml-4 w-1/3 lg:w-1/5">
          <SideNavigation
            v-if="categories && 'children' in categories && categories.children"
            :categories="categories.children"
            :fetching="categoriesFetching"
            :root-category="categories"
            show-nested-categories />
        </div>
        <div class="w-full">
          <template v-if="preListingContent && isFirstPage">
            <component
              :is="preContent.component"
              v-for="preContent in preListingContent"
              :key="preContent._uid"
              :blok="preContent" />
          </template>

          <div
            class="flex flex-col items-start justify-between overflow-x-hidden">
            <ProductListBreadcrumbs />
            <div
              class="mt-2 flex w-full flex-col justify-between space-y-2 md:flex-row">
              <ProductQuickFilters
                :filters="quickFilters"
                :loading="filtersFetching"
                :total-count="unfilteredCount"
                @click:selected-filter="applyFilter($event, true)" />
              <div class="order-1 flex items-center space-x-4 text-sm">
                <SortingMenu
                  :selected="selectedSort.name"
                  :values="sortingValues" />
                <AppButton
                  data-test-id="filter-toggle-button"
                  type="tertiary"
                  size="sm"
                  @click="toggleFilter">
                  <template #icon="{ _class }">
                    <IconFilter :class="_class" />
                  </template>
                  {{ $t('plp.filter') }}
                </AppButton>
              </div>
            </div>
          </div>
          <ProductList
            :loading="productsFetching"
            :per-page="PRODUCTS_PER_PAGE"
            :products="products"
            :refreshing="productsFetching"
            class="mt-8 grid w-auto grid-cols-12 gap-1"
            @click:product="trackProductClick"
            @intersect:row="trackViewListing" />
          <NuxtLazyHydrate :when-visible="{ rootMargin: '100px' }">
            <Pagination
              v-if="pagination"
              class="mt-16"
              :current-page="pagination.page"
              :first-page="pagination.first"
              :last-page="pagination.last" />
          </NuxtLazyHydrate>

          <template v-if="postListingContent && isFirstPage">
            <component
              :is="preContent.component"
              v-for="preContent in postListingContent"
              :key="preContent._uid"
              :blok="preContent" />
          </template>
        </div>
        <FilterSlideIn
          v-if="filters"
          :active-filters="activeFilters"
          :filters="filters"
          :filtered-count="filteredProductsCount"
          :unfiltered-count="unfilteredCount"
          :fetching-filtered-count="productCountFetching"
          @filter:apply="applyFilter"
          @filter:state-changed="updateFilterCount($event)" />
      </div>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import {
  Product,
  SortValue,
  getSortByValue,
  getSortingValues,
  groupFilterableValuesByKey,
  transformToWhereCondition,
} from '@scayle/storefront-nuxt'
import { SbCmsImage, SbListingPage } from '../storyblok/types/storyblok'
import { sustainabilityAttributes } from '~/constants'

const PRODUCTS_PER_PAGE = 24
const DEFAULT_SORTING_KEY = 'dateNewest'
const INCLUDED_QUICK_FILTERS = ['sale', 'isNew', 'styleGroup']

const listingMetaData = {
  name: 'Category Product List',
  id: 'CategoryProductList',
}

const { isGreaterOrEquals } = useViewport()

const route = useRoute()
const store = useStore()

const term = computed(() => route.query.term || '')

const categoryPath = computed(() => {
  if (Array.isArray(route.params.category)) {
    return `/${route.params.category.join('/')}`
  }
  return `/${route.params.category}`
})

const { toggle: toggleFilter } = useSlideIn('FilterSlideIn')

const { trackViewItemList, trackSelectItem, trackFilterApply } =
  useTrackingEvents()

const {
  products,
  productsFetching,
  productStatus,
  categoriesStatus,
  filterStatus,
  categoriesFetching,
  categories,
  selectedCategory,
  fetchProducts,
  pagination,
  filters,
  filtersFetching,
  unfilteredCount,
  productCountData,
  refreshProductCount,
  productCountFetching,
  productError,
  filterError,
  categoriesError,
} = await useFacet({
  key: `useFacet-${categoryPath.value}`,
  params: {
    with: {
      product: {
        attributes: {
          withKey: ['color', 'brand', 'name', ...sustainabilityAttributes],
        },
        variants: {
          attributes: {
            withKey: ['price'],
          },
          lowestPriorPrice: true,
        },
        siblings: {
          attributes: { withKey: ['color', 'brand', 'name'] },
        },
        images: {
          attributes: {
            withKey: ['imageType', 'imageView', 'imageBackground', 'imageKind'],
          },
        },
        priceRange: true,
        lowestPriorPrice: true,
        categories: {
          properties: {
            withName: ['baseCategories'],
          },
        },
      },
    },
    includedFilters: INCLUDED_QUICK_FILTERS,
  },
})

const updateFilterCount = async (filter: Record<string, any>) => {
  await refreshProductCount({
    where: transformToWhereCondition(filter),
  })
}

const customDefaultSorting = computed(
  () => selectedCategory.value?.shopLevelCustomData?.defaultSorting,
)

const selectedSort = computed(() => {
  if (route.query.sort || !customDefaultSorting.value) {
    return getSortByValue(
      route.query.sort || '',
      DEFAULT_SORTING_KEY,
    ) as SortValue
  }
  return getSortByValue(customDefaultSorting.value)
})

const sortingValues = Object.values(getSortingValues())

const {
  applyFilters: _applyFilter,
  productConditions,
  activeFilters,
} = useQueryFilterState({ defaultSort: DEFAULT_SORTING_KEY })

const trackViewListing = ({ items }: { row: number; items: Product[] }) => {
  const paginationOffset = ((pagination.value?.page || 1) - 1) * 24
  trackViewItemList({
    items,
    listingMetaData,
    paginationOffset,
    source: `category|${selectedCategory.value?.id}`,
  })
}

const fetchParameters = computed(() => ({
  path: categoryPath,
  ...productConditions.value,
  where: {
    ...productConditions?.value?.where,
    term: term.value.toString(),
  },
  perPage: PRODUCTS_PER_PAGE,
  cache: {
    ttl: 1000,
    cacheKeyPrefix: `PLP:${categoryPath}`,
  },
  sort: {
    ...selectedSort.value,
  },
}))

watch(
  () => route.query,
  async () => {
    await fetchProducts(fetchParameters.value)
  },
)

const trackProductClick = (product: Product) => {
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

const applyFilter = (
  filter: Record<string, any>,
  preserveAttributeFilters = false,
) => {
  const attributeFilters: Record<string, any> =
    route.query.value && preserveAttributeFilters
      ? parseAndPreserveAttributeFilters()
      : {}
  const combinedFilters = { ...filter, ...attributeFilters }
  if (!isEmpty(combinedFilters)) {
    Object.keys(combinedFilters).forEach((key: string) => {
      const values = Array.isArray(combinedFilters[key])
        ? combinedFilters[key].join('|')
        : combinedFilters[key]
      trackFilterApply(key, values)
    })
  }

  _applyFilter(combinedFilters)
}

// TODO: Refactor to consolidate logic and remove non-presentation logic to helpers
const parseAndPreserveAttributeFilters = () => {
  // Attribute filters such as color should be preserved
  const attributeFilters: Record<string, any> = {}
  const keysToExclude = quickFilters.value.map((filter) => filter.key)
  const filtersFromQueryParams = JSON.parse(
    (route.query.value as any).filters || '{}',
  )
  for (const key of Object.keys(filtersFromQueryParams)) {
    if (!keysToExclude.includes(key.toLowerCase())) {
      attributeFilters[key] = filtersFromQueryParams[key]
    }
  }
  return attributeFilters
}

const quickFilters = computed(() =>
  filters.value
    ? groupFilterableValuesByKey(filters.value, INCLUDED_QUICK_FILTERS).filter(
        (filter) => !!filter.count,
      )
    : [],
)

// CMS
const {
  fetchBySlug,
  data: cmsData,
  status: cmsStatus,
} = useCms<SbListingPage>(`ListingPage-${route.path}`)

const fetchData = async () => {
  await fetchProducts(fetchParameters.value)
  await fetchBySlug(`categories/${selectedCategory.value?.id}`)
  if (productError.value || filterError.value || categoriesError.value) {
    throw createError(
      productError.value || filterError.value || categoriesError.value,
    )
  }
}

if (
  productStatus.value === 'idle' ||
  filterStatus.value === 'idle' ||
  categoriesStatus.value === 'idle' ||
  cmsStatus.value === 'idle'
) {
  await fetchLazy(fetchData())
}

const { content, hasTeaserImage, postListingContent, preListingContent } =
  useCmsListingContent(cmsData)

const cmsContent = content as unknown as SbCmsImage

const isFirstPage = computed(() => pagination.value?.page === 1)
const filteredProductsCount = computed(() => productCountData.value?.count || 0)

watch(
  () => selectedCategory.value?.id,
  (id) => {
    if (!id) {
      return
    }
    store.value.pageTypeId = id
  },
  { immediate: true },
)

const { $i18n, $config } = useNuxtApp()
const isFiltered = computed(
  () => !!productConditions.value.where?.attributes?.length,
)
const robots = computed(() =>
  isFiltered.value ? 'noindex,follow' : 'index,follow',
)

useSeoMeta(() => ({
  robots: robots.value,
  description: $i18n.t('plp.seo_description', {
    categoryName: selectedCategory.value?.name,
    gender: 'women',
  }),
  title: `${$i18n.t('global.gender.women')} ${selectedCategory.value?.name}`,
}))

useHead(() => ({
  link: robots.value?.includes('noindex')
    ? []
    : [
        {
          rel: 'canonical',
          href: prepareCanonicalURL(
            `${$config.public.baseUrl}${route?.fullPath}`,
          ),
        },
      ],
}))

definePageMeta({ pageType: 'category_page' })
</script>

<script lang="ts">
export default {
  name: 'ProductListingPage',
}
</script>
