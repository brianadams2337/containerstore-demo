<template>
  <div>
    <div v-if="hasTeaserImage">
      <CmsImage :blok="cmsContent" is-teaser />
    </div>
    <PageContent v-if="products" class="sm:flex">
      <div
        v-show="viewport.isGreaterOrEquals('md')"
        class="-ml-4 w-1/3 lg:w-1/5"
      >
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

        <NuxtLazyHydrate>
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
                <AppButton
                  data-test-id="filter-toggle-button"
                  type="tertiary"
                  size="sm"
                  @click="toggleFilter"
                >
                  <template #icon="{ _class }">
                    <IconFilter :class="_class" />
                  </template>
                  {{ $t('plp.filter') }}
                </AppButton>
              </div>
            </div>
          </div>
        </NuxtLazyHydrate>
        <ProductList
          :loading="productsFetching"
          :products="products"
          :refreshing="productsFetching"
          class="mt-8 grid w-auto grid-cols-12 gap-1"
          @click:product="trackProductClick"
          @intersect:row="trackViewListing"
        />
        <NuxtLazyHydrate :when-visible="{ rootMargin: '100px' }">
          <Pagination
            v-if="pagination"
            class="mt-16"
            :current-page="pagination.page"
            :first-page="pagination.first"
            :last-page="pagination.last"
          />
        </NuxtLazyHydrate>

        <template v-if="postListingContent && isFirstPage">
          <component
            :is="preContent.component"
            v-for="preContent in postListingContent"
            :key="preContent._uid"
            :blok="preContent"
          />
        </template>
      </div>
      <FilterSlideIn v-if="filters" />
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'
import type { SbCmsImage, SbListingPage } from '../storyblok/types/storyblok'

const route = useRoute()
const store = useStore()
const { $i18n, $config } = useNuxtApp()

const { toggle: toggleFilter } = useSlideIn('FilterSlideIn')

const { trackViewItemList, trackSelectItem } = useTrackingEvents()

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
  productError,
  filterError,
  categoriesError,
  fetchParameters,
  listingMetaData,
} = await useProductList()

const { selectedSort, sortingValues } = useProductListSort(selectedCategory)

const { isFiltered } = await useFilter()

const trackViewListing = ({ items }: { row: number; items: Product[] }) => {
  const paginationOffset = ((pagination.value?.page || 1) - 1) * 24
  trackViewItemList({
    items,
    listingMetaData,
    paginationOffset,
    source: `category|${selectedCategory.value?.id}`,
  })
}

// CMS
const {
  fetchBySlug,
  data: cmsData,
  status: cmsStatus,
} = useCms<SbListingPage>(`ListingPage-${route.path}`)

const fetchData = async () => {
  await Promise.all([
    fetchProducts(fetchParameters.value),
    fetchBySlug(`categories/${selectedCategory.value?.id}`),
  ])
}

if (
  productStatus.value === 'idle' ||
  filterStatus.value === 'idle' ||
  categoriesStatus.value === 'idle' ||
  cmsStatus.value === 'idle'
) {
  await fetchLazy(fetchData())
}

const error = computed(() => {
  return productError.value || filterError.value || categoriesError.value
})

if (error.value) {
  throw error.value
}

const viewport = useViewport()

watch(
  () => route.query,
  async () => await fetchProducts(fetchParameters.value),
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

const { content, hasTeaserImage, postListingContent, preListingContent } =
  useCmsListingContent(cmsData)

const cmsContent = content as unknown as SbCmsImage

const isFirstPage = computed(() => pagination.value?.page === 1)

watch(
  () => selectedCategory.value?.id,
  (id) => {
    if (!id) {
      return
    }
    store.value.pageTypeId = String(id)
  },
  { immediate: true },
)

const robots = computed(() =>
  isFiltered.value ? 'noindex,follow' : 'index,follow',
)

useSeoMeta(() => ({
  robots: robots.value,
  description: $i18n.t('plp.seo_description', {
    categoryName: selectedCategory.value?.name.toLowerCase(),
  }),
  title: selectedCategory.value?.name,
}))

useHead(() => ({
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
