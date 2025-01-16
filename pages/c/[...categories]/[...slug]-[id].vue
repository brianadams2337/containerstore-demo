<template>
  <CMSCategoryData :selected-category="currentCategoryId" class="flex flex-col">
    <template #default="{ content, hasTeaserImage }">
      <CMSImage
        v-if="hasTeaserImage"
        :blok="content"
        is-teaser
        is-cover
        class="-mb-8 !h-52 w-full sm:mb-0"
      />

      <div
        class="relative mx-0 flex rounded-t-2xl bg-white pt-4 xl:container md:mx-8 md:rounded-none md:pt-8 xl:m-auto"
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
            <div class="flex items-center px-4 md:px-0">
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
            v-if="allCategories.length"
            :all-categories="allCategories"
            :current-category="currentCategory"
            class="mb-3.5 mt-2.5 md:hidden"
          />
          <div class="px-4 md:hidden">
            <SFFilterToggleButton :label="$t('filter.filters_sorting')" />
          </div>
          <SFProductList
            :products="products"
            :pagination="pagination"
            :current-category="currentCategory"
            :loading="productsStatus === 'pending'"
            class="mt-8"
            @click:product="trackProductClick"
            @intersect:row="trackViewListing"
          />
        </div>
      </div>
      <SFFilterSlideIn :current-category-id="currentCategoryId" />
      <Teleport to="#teleports">
        <SFFloatingContainer class="right-4 md:bottom-16">
          <SFScrollToTopButton />
        </SFFloatingContainer>
      </Teleport>
    </template>
  </CMSCategoryData>
</template>

<script setup lang="ts">
import { useSeoMeta, useHead } from '@unhead/vue'
import {
  onMounted,
  toRefs,
  onServerPrefetch,
  watch,
  defineOptions,
  computed,
} from 'vue'
import {
  HttpStatusCode,
  type Product,
  type Category,
} from '@scayle/storefront-nuxt'
import { useI18n } from 'vue-i18n'
import { definePageMeta } from '#imports'
import {
  useTrackingEvents,
  usePageState,
  useJsonld,
  useBreadcrumbs,
} from '~/composables'
import { createError } from '#app/composables/error'
import { useRoute } from '#app/composables/router'
import { getCategoryId } from '~/utils'
import {
  categoryListingMetaData,
  PRODUCT_TILE_WITH_PARAMS,
  PRODUCTS_PER_PAGE,
} from '~/constants'
import CMSCategoryData from '#storefront-cms/components/fetching/CMSCategoryData.vue'
import CMSImage from '#storefront-cms/components/Image.vue'
import SFCategorySideNavigation from '~/components/category/SFCategorySideNavigation.vue'
import SFCategoryNavigationBackButton from '~/components/category/SFCategoryNavigationBackButton.vue'
import SFCategoryBreadcrumbs from '~/components/category/SFCategoryBreadcrumbs.vue'
import SFSortSelection from '~/components/sorting/SFSortSelection.vue'
import SFFilterToggleButton from '~/components/filter/SFFilterToggleButton.vue'
import SFCategoryNavigationSlider from '~/components/category/SFCategoryNavigationSlider.vue'
import SFProductList from '~/components/productList/SFProductList.vue'
import SFFilterSlideIn from '~/components/filter/SFFilterSlideIn.vue'
import SFFloatingContainer from '~/components/SFFloatingContainer.vue'
import SFScrollToTopButton from '~/components/SFScrollToTopButton.vue'
import {
  useProductListingSeoData,
  useProductsForListing,
  useAppliedFilters,
  useProductListSort,
} from '#storefront-product-listing'
import { useCategoryById } from '#storefront/composables'
import { useNuxtApp } from '#app'

const route = useRoute()
const { $config } = useNuxtApp()
const i18n = useI18n()

const { pageState, setPageState } = usePageState()

const { trackViewItemList, trackSelectItem } = useTrackingEvents()

const props = defineProps<{
  rootCategories: Category[]
  fetchingCategories: boolean
  allCategories: Category[]
}>()

const { rootCategories, fetchingCategories, allCategories } = toRefs(props)

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

const currentCategoryPromise = useCategoryById(
  {
    params: {
      id: currentCategoryId.value,
      children: 0,
      properties: { withName: ['sale'] },
    },
  },
  `current-category-${currentCategoryId.value}`,
)

const {
  data: currentCategory,
  status: categoryStatus,
  error: categoryError,
} = currentCategoryPromise

const validateCategoryExists = async () => {
  await currentCategoryPromise

  if (
    categoryError.value ||
    (categoryStatus.value !== 'pending' && !currentCategory.value)
  ) {
    throw createError({ statusCode: HttpStatusCode.NOT_FOUND, fatal: true })
  }
}

onServerPrefetch(validateCategoryExists)
onMounted(validateCategoryExists)

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

useSeoMeta({ robots })

useHead(() => {
  if (!currentCategory.value) {
    return {}
  }
  return {
    title: title.value,
    meta: [
      {
        name: 'description',
        content: i18n.t('plp.seo_description', {
          category: currentCategory.value,
        }),
      },
    ],
    link: canonicalLink.value,
  }
})

defineOptions({ name: 'CategoryPage' })
definePageMeta({ pageType: 'category_page', middleware: ['category'] })
</script>
