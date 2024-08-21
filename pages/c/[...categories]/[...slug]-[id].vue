<template>
  <CMSCategoryData :selected-category="currentCategoryId" class="flex flex-col">
    <template #default="{ content, hasTeaserImage }">
      <CMSImage
        v-if="hasTeaserImage"
        :blok="content"
        is-teaser
        is-cover
        class="-mb-8 h-[12.5rem] w-full sm:mb-0"
      />

      <div
        class="relative mx-0 flex rounded-t-[1.25rem] bg-white xl:container md:mx-8 md:rounded-none md:pt-8 xl:m-auto"
        :class="hasTeaserImage && 'pt-4'"
      >
        <CategorySideNavigation
          v-if="rootCategories?.length"
          class="sticky top-8 h-full max-md:hidden sm:min-w-40 md:min-w-[14.75rem] lg:min-w-[17rem]"
          :root-categories="rootCategories"
          :current-category="currentCategory"
          :fetching-categories="fetchingCategories"
        />

        <div class="w-full grow">
          <div class="flex flex-wrap items-center justify-between gap-5">
            <div class="flex items-center px-4 md:px-0">
              <CategoryNavigationBackButton
                :current-category="currentCategory"
                class="mr-2 md:hidden"
              />
              <CategoryBreadcrumbs
                :products-fetching="productsFetching"
                :category="currentCategory"
                :products-count="totalProductsCount"
              />
            </div>
            <div class="hidden gap-4 md:flex">
              <SortSelection class="max-sm:hidden" />
              <FilterToggleButton :label="$t('filter.show_filter')" />
            </div>
          </div>
          <CategoryNavigationSlider
            v-if="allCategories.length"
            :all-categories="allCategories"
            :current-category="currentCategory"
            class="my-3.5 md:hidden"
          />
          <div class="px-4 md:hidden">
            <FilterToggleButton :label="$t('filter.filters_sorting')" />
          </div>
          <ProductList
            :products="products"
            :pagination="pagination"
            :current-category="currentCategory"
            :loading="productsFetching"
            class="mt-8"
            @click:product="trackProductClick"
            @intersect:row="trackViewListing"
          />
        </div>
      </div>
      <FilterSlideIn :current-category="currentCategory" />
      <ProductListScrollToTopButton />
    </template>
  </CMSCategoryData>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { watch, defineOptions, computed } from 'vue'
import { HttpStatusCode, type Product } from '@scayle/storefront-nuxt'
import {
  definePageMeta,
  useJsonld,
  useServerSeoMeta,
  useSeoMeta,
} from '#imports'
import {
  useRootCategories,
  useCurrentCategory,
  useProductsByCategory,
  useTrackingEvents,
  usePageState,
  useCategorySeoData,
} from '~/composables'
import { createError } from '#app/composables/error'
import { useRoute } from '#app/composables/router'
import { getCategoryId } from '~/utils'
import { categoryListingMetaData } from '~/constants'

const route = useRoute()

const { pageState, setPageState } = usePageState()

const { trackViewItemList, trackSelectItem } = useTrackingEvents()

const { rootCategories, fetchingCategories, allCategories } = useRootCategories(
  {
    key: 'category-navigation-tree',
    children: 5,
  },
)

const currentCategoryId = computed(() => getCategoryId(route.params))

const {
  data: currentCategory,
  fetching: isCategoryFetching,
  error: categoryError,
} = await useCurrentCategory(currentCategoryId.value)

if (categoryError.value) {
  throw categoryError.value
}

if (!isCategoryFetching && !currentCategory.value) {
  throw createError({ statusCode: HttpStatusCode.NOT_FOUND, fatal: true })
}

const {
  products,
  pagination,
  fetching: productsFetching,
  error: productsError,
  totalProductsCount,
  paginationOffset,
} = await useProductsByCategory(currentCategory, { options: { lazy: true } })

if (productsError.value) {
  throw productsError.value
}

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

watch(
  () => currentCategoryId.value,
  (id) => id && setPageState('typeId', String(id)),
  { immediate: true },
)
const {
  title,
  metaDescription,
  robots,
  canonicalLink,
  categoryBreadcrumbSchema,
} = useCategorySeoData(currentCategory)

useJsonld(() => categoryBreadcrumbSchema.value)

useServerSeoMeta({ robots: 'index,follow' })
useSeoMeta({ robots })

useHead(() => {
  if (!currentCategory.value) {
    return {}
  }
  return {
    title: title.value,
    meta: [{ name: 'description', content: metaDescription.value }],
    link: canonicalLink.value,
  }
})

defineOptions({ name: 'CategoryPage' })
definePageMeta({ pageType: 'category_page', middleware: ['category'] })
</script>
