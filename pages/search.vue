<template>
  <section class="container overflow-hidden pt-4 max-sm:max-w-none md:pt-8">
    <div class="flex w-full flex-wrap justify-between gap-4">
      <SFHeadline
        tag="h1"
        class="mt-1.5 line-clamp-2 !font-semi-bold-variable text-gray-900 max-sm:text-2xl max-sm:leading-6 sm:mt-0"
      >
        {{ $t('search.page.heading', { term }) }}
        <SFFadeInTransition>
          <span
            v-if="totalProductsCount > 0 && status === 'success'"
            class="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold leading-4 text-white"
          >
            {{ totalProductsCount }}
          </span>
        </SFFadeInTransition>
      </SFHeadline>

      <SFFilterToggleButton
        v-if="showFiltersButton"
        class="hidden md:flex"
        :label="$t('filter.show_filter')"
      />
    </div>

    <SFFilterToggleButton
      v-if="showFiltersButton"
      class="mt-4 md:hidden"
      :label="$t('filter.show_filter')"
    />

    <SFProductList
      :products="products"
      :pagination="pagination"
      :loading="isLoading"
      class="mt-6"
    />

    <SFFilterSlideIn hide-sorting />
  </section>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useRoute } from '#app/composables/router'
import { PRODUCT_TILE_WITH_PARAMS, PRODUCTS_PER_PAGE } from '~/constants'
import { SFHeadline, SFFadeInTransition } from '#storefront-ui/components'
import {
  useAppliedFilters,
  useProductsForListing,
} from '#storefront-product-listing'
import { useNuxtApp } from '#app/nuxt'
import SFProductList from '~/components/productList/SFProductList.vue'
import SFFilterSlideIn from '~/components/filter/SFFilterSlideIn.vue'
import SFFilterToggleButton from '~/components/filter/SFFilterToggleButton.vue'

const route = useRoute()
const { $i18n } = useNuxtApp()

const { appliedFilter } = useAppliedFilters(route)

const term = computed(() => appliedFilter.value.term ?? '')

const { products, pagination, status, totalProductsCount } =
  useProductsForListing({
    params: computed(() => ({
      where: appliedFilter.value,
      perPage: PRODUCTS_PER_PAGE,
      page: Number(route.query.page) || 1,
      with: PRODUCT_TILE_WITH_PARAMS,
      includeSoldOut: false,
      includeSellableForFree: false,
    })),
  })

const isLoading = computed(() => status.value === 'pending')
const showFiltersButton = computed(() => {
  // Show the filters buttons always when we are in the loading state
  if (isLoading.value) {
    return true
  }

  // Otherwise we only show it when we have some products
  return totalProductsCount.value > 0
})

useSeoMeta({
  robots: 'noindex,follow',
  title: () => $i18n.t('search.page.meta.title', { term: term.value }),
})

defineOptions({ name: 'SearchPage' })
definePageMeta({ pageType: 'search_result_page' })
</script>
