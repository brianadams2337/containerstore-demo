<template>
  <SFPageContainer>
    <div class="flex w-full flex-wrap justify-between gap-4">
      <SFHeadline is-uppercase tag="h1">
        {{
          status === 'pending'
            ? $t('search.result_loading', { term })
            : $t('search.result', { term, resultsCount })
        }}
      </SFHeadline>
      <div class="hidden gap-4 md:flex">
        <SFSortSelection class="max-sm:hidden" />
        <SFFilterToggleButton :label="$t('filter.show_filter')" />
      </div>
    </div>
    <div class="mt-2 md:hidden">
      <SFFilterToggleButton :label="$t('filter.filters_sorting')" />
    </div>
    <SFProductList
      :pagination="pagination"
      :products="products"
      :loading="status === 'pending'"
      class="mt-8"
      @click-product="trackProductClick"
      @intersect:row="trackViewListing"
    />
    <SFFilterSlideIn />
  </SFPageContainer>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import type { Product } from '@scayle/storefront-nuxt'
import { definePageMeta } from '#imports'
import {
  usePageState,
  useProductsSearch,
  useTrackingEvents,
} from '~/composables'
import { useRoute } from '#app/composables/router'
import { useI18n } from '#i18n'
import { categoryListingMetaData } from '~/constants'
import SFProductList from '~/components/productList/SFProductList.vue'
import SFFilterSlideIn from '~/components/filter/SFFilterSlideIn.vue'
import SFSortSelection from '~/components/sorting/SFSortSelection.vue'
import SFFilterToggleButton from '~/components/filter/SFFilterToggleButton.vue'
import { SFHeadline, SFPageContainer } from '#storefront-ui/components'

const route = useRoute()

const { t } = useI18n()

const term = computed(() => route.query['filters[term]'] || '')
const { pageState } = usePageState()
const { products, pagination, status, totalProductsCount, paginationOffset } =
  await useProductsSearch({
    options: { lazy: true },
    params: { includeSoldOut: false },
  })

const { trackSelectItem, trackViewItemList } = useTrackingEvents()

const resultsCount = computed(() => totalProductsCount.value)
const title = computed(() => {
  return `${t('search.page_title', { term: term.value.toString() })}`
})

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
    source: 'search',
  })
}

useSeoMeta({
  robots: 'index,follow',
  title,
  titleTemplate: (pageTitle) => pageTitle ?? null,
})

defineOptions({ name: 'SearchPage' })
definePageMeta({ pageType: 'search_result_page' })
</script>
