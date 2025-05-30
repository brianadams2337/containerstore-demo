<template>
  <div class="flex flex-col">
    <CMSProductListingPageTeaser
      :category-id="currentCategoryId"
      class="-mb-8 !h-52 w-full sm:mb-0"
    />

    <div
      class="container relative flex rounded-t-2xl bg-white pt-4 max-sm:max-w-none md:rounded-none md:pt-8"
    >
      <SFCategorySideNavigation
        v-if="rootCategories?.length"
        class="sticky top-8 h-full max-md:hidden sm:min-w-40 md:min-w-[14.75rem] lg:min-w-[17rem]"
        :root-categories="rootCategories"
        :current-category="currentCategory"
        :fetching-categories="fetchingCategories"
      />

      <div class="w-full grow">
        <div class="flex flex-wrap items-center justify-between gap-5">
          <div class="flex items-center">
            <SFCategoryNavigationBackButton
              :current-category="currentCategory"
              class="mr-2 md:hidden"
            />
            <SFCategoryBreadcrumbs
              v-if="currentCategory"
              :products-fetching="productsStatus === 'pending'"
              :category="currentCategory"
              :products-count="totalProductsCount"
            />
          </div>
          <div class="hidden gap-4 md:flex">
            <SFSortSelection class="max-sm:hidden" />
            <SFFilterToggleButton :label="$t('filter.show_filter')" />
          </div>
        </div>
        <SFCategoryNavigationSlider
          v-if="rootCategories?.length"
          :all-categories="flattenCategoryTree(rootCategories)"
          :current-category="currentCategory"
          class="mb-3.5 mt-2.5 md:hidden"
        />
        <SFFilterToggleButton
          class="md:hidden"
          :label="$t('filter.show_filter_and_sorting')"
        />
        <SFProductList
          :products="products"
          :pagination="pagination"
          :current-category="currentCategory"
          :loading="productsStatus === 'pending'"
          class="mt-6"
          @click-product="trackProductClick"
          @intersect:row="trackViewListing"
        />
      </div>
    </div>
    <SFFilterSlideIn :current-category-id="currentCategoryId" />
    <Teleport to="#teleports">
      <div class="fixed bottom-8 right-4 md:bottom-24">
        <SFScrollToTopButton />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onServerPrefetch, watch, defineOptions, computed } from 'vue'
import {
  HttpStatusCode,
  type Product,
  type Category,
} from '@scayle/storefront-nuxt'
import { useSeoMeta, useHead, definePageMeta } from '#imports'
import { useI18n, type Locale } from '#i18n'
import { navigateTo, useRoute } from '#app/composables/router'
import { useNuxtApp } from '#app/nuxt'
import {
  useTrackingEvents,
  usePageState,
  useJsonld,
  useBreadcrumbs,
  useRouteHelpers,
} from '~/composables'
import { createError } from '#app/composables/error'
import { getCategoryId } from '~/utils'
import {
  categoryListingMetaData,
  PRODUCT_TILE_WITH_PARAMS,
  PRODUCTS_PER_PAGE,
} from '~/constants'
import CMSProductListingPageTeaser from '#storefront-cms/components/ProductListingPageTeaser.vue'
import SFCategorySideNavigation from '~/components/category/SFCategorySideNavigation.vue'
import SFCategoryNavigationBackButton from '~/components/category/SFCategoryNavigationBackButton.vue'
import SFCategoryBreadcrumbs from '~/components/category/SFCategoryBreadcrumbs.vue'
import SFSortSelection from '~/components/sorting/SFSortSelection.vue'
import SFFilterToggleButton from '~/components/filter/SFFilterToggleButton.vue'
import SFCategoryNavigationSlider from '~/components/category/SFCategoryNavigationSlider.vue'
import SFProductList from '~/components/productList/SFProductList.vue'
import SFFilterSlideIn from '~/components/filter/SFFilterSlideIn.vue'
import SFScrollToTopButton from '~/components/SFScrollToTopButton.vue'
import {
  useProductListingSeoData,
  useProductsForListing,
  useAppliedFilters,
  useProductListSort,
  useAllShopCategoriesForId,
  generateProductListingHreflangLinks,
  flattenCategoryTree,
} from '#storefront-product-listing'
import { useCategoryById } from '#storefront/composables'

const route = useRoute()
const { $config } = useNuxtApp()
const i18n = useI18n()
const { buildCategoryPath, getLocalizedHref } = useRouteHelpers()

const { pageState, setPageState } = usePageState()

const { trackViewItemList, trackSelectItem } = useTrackingEvents()

const { rootCategories, fetchingCategories } = defineProps<{
  rootCategories: Category[]
  fetchingCategories: boolean
}>()

const currentCategoryId = computed(() => getCategoryId(route.params))
const { selectedSort } = useProductListSort(route)
const { appliedFilter } = useAppliedFilters(route)

const params = computed(() => ({
  categoryId: currentCategoryId.value,
  with: PRODUCT_TILE_WITH_PARAMS,
  sort: selectedSort.value,
  perPage: PRODUCTS_PER_PAGE,
  where: appliedFilter.value,
  page: Number(route.query.page) || 1,
}))

const {
  products,
  pagination,
  status: productsStatus,
  totalProductsCount,
  paginationOffset,
} = useProductsForListing({
  params,
  fetchingOptions: { lazy: true },
})

const categoryParams = computed(() => ({
  id: currentCategoryId.value,
  children: 0,
  properties: { withName: ['sale'] },
}))

const {
  data: currentCategory,
  status: categoryStatus,
  error: categoryError,
} = useCategoryById(
  {
    params: categoryParams,
    options: {
      dedupe: 'defer',
    },
  },
  'plp-current-category',
)

// Validates that the category exists and redirects to the correct path if the URL is incorrect but the category ID is valid
// If an error occurs or the category is not found, a 404 error is thrown also redirecting to the correct path if the category ID is valid but the path is incorrect
const validateCategoryExistsAndRedirect = async () => {
  if (categoryStatus.value == 'pending') {
    return
  }

  if (categoryError.value || !currentCategory.value) {
    throw createError({ statusCode: HttpStatusCode.NOT_FOUND, fatal: true })
  }

  const expectedPath = buildCategoryPath(currentCategory.value)
  if (expectedPath !== route.path) {
    return navigateTo(
      { path: expectedPath, query: route.query, hash: route.hash },
      { redirectCode: 301 },
    )
  }
}

onServerPrefetch(validateCategoryExistsAndRedirect)

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

const trackViewListing = ({
  items,
}: {
  row: number
  items: (Product & { index: number })[]
}) => {
  trackViewItemList({
    items,
    listingMetaData: categoryListingMetaData,
    paginationOffset: paginationOffset.value,
    source: `category|${currentCategoryId.value}`,
  })
}

const shopCategoryparams = computed(() => ({
  id: currentCategoryId.value,
}))

const { data: categoriesForAllShops } = useAllShopCategoriesForId({
  params: shopCategoryparams,
})

watch(
  [currentCategory, () => route.path],
  async ([category]) => {
    await validateCategoryExistsAndRedirect()
    setPageState('typeId', String(category?.id))
  },
  { immediate: true },
)

const { getBreadcrumbsFromCategory } = useBreadcrumbs()
const breadcrumbs = computed(() =>
  currentCategory.value
    ? getBreadcrumbsFromCategory(currentCategory.value, true)
    : [],
)

const { title, robots, canonicalLink, categoryBreadcrumbSchema } =
  useProductListingSeoData(breadcrumbs, route, {
    baseUrl: $config.public.baseUrl,
    fullPath: route.fullPath,
  })

useJsonld(() => categoryBreadcrumbSchema.value)

useSeoMeta({
  robots,
  title: () => title.value,
  description: () => {
    if (!currentCategory.value) {
      return null
    }
    return i18n.t('product_list_page.meta.description', {
      category: currentCategory.value.name,
      shopName: $config.public.shopName,
    })
  },
})

const hreflangLinks = generateProductListingHreflangLinks(
  (categoriesForAllShops.value ?? []).map(({ category, path, locale }) => {
    const localizedCategoryPath = buildCategoryPath(category, path as Locale)
    const href = getLocalizedHref(path as Locale, localizedCategoryPath)
    return {
      categoryHref: href,
      path,
      locale,
    }
  }),
  i18n.defaultLocale,
)

useHead(() => ({
  link: [...canonicalLink.value, ...hreflangLinks],
}))

defineOptions({ name: 'CategoryPage' })

// The 'key' is required to preserve component state across PLP navigation.
// Without it, components like 'SFCategorySideNavigation' are re-rendered on every route change,
// leading to focus loss and unnecessary performance overhead.
definePageMeta({
  pageType: 'category_page',
  key: 'PLP',
})
</script>
