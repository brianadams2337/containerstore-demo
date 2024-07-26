<template>
  <PageContent>
    <div class="flex w-full flex-wrap justify-between gap-4">
      <SFHeadline is-uppercase>
        {{ $t('search.result', { term, resultsCount }) }}
      </SFHeadline>
      <div class="hidden gap-4 md:flex">
        <SortSelection class="max-sm:hidden" />
        <FilterToggleButton :label="$t('filter.show_filter')" />
      </div>
    </div>
    <div class="mt-2 md:hidden">
      <FilterToggleButton :label="$t('filter.filters_sorting')" />
    </div>
    <ProductList
      v-bind="{ pagination, products }"
      :loading="productsFetching"
      class="mt-8"
      @click:product="trackProductClick"
      @intersect:row="trackViewListing"
    />
    <FilterSlideIn />
  </PageContent>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import type { Product } from '@scayle/storefront-nuxt'
import { definePageMeta, useTrackingEvents } from '#imports'
import { usePageState, useProductsSearch } from '~/composables'
import { useNuxtApp } from '#app'
import { useRoute } from '#app/composables/router'
import { categoryListingMetaData } from '~/constants'

const route = useRoute()

const { $i18n } = useNuxtApp()
const term = computed(() => route.query.term || '')
const { pageState } = usePageState()
const {
  products,
  pagination,
  fetching: productsFetching,
  totalProductsCount,
  paginationOffset,
} = await useProductsSearch({ options: { lazy: true } })

const { trackSelectItem, trackViewItemList } = useTrackingEvents()

const resultsCount = computed(() => totalProductsCount.value)
const title = computed(() => {
  return `${$i18n.t('search.seo_title', {
    term: term.value.toString(),
    count: resultsCount.value?.toString(),
  })}`
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

const trackViewListing = ({ items }: { row: number; items: Product[] }) => {
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
})

defineOptions({ name: 'SearchPage' })
definePageMeta({ pageType: 'search_result_page' })
</script>
