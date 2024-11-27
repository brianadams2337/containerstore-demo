<template>
  <main class="container mt-8 max-sm:max-w-none">
    <SFHeadline
      tag="h1"
      class="mt-1.5 !font-semi-bold-variable text-gray-900 max-sm:text-2xl max-sm:leading-6 sm:mt-0"
    >
      {{ $t('wishlist.heading') }}
      <SFFadeInTransition>
        <span
          v-if="count !== undefined && count > 0"
          class="ml-0.5 inline-flex h-[1.125rem] items-center rounded-[1.25rem] bg-gray-900 px-2 text-xs font-semibold leading-4 text-white"
        >
          {{ count }}
        </span>
      </SFFadeInTransition>
    </SFHeadline>

    <template v-if="fetching">
      <div class="mt-8 grid w-auto grid-cols-12 gap-4 xl:max-2xl:grid-cols-10">
        <ProductCardSkeleton
          v-for="index in 12"
          :key="`product-loading-${index}`"
          type="custom"
          class="col-span-6 mb-4 sm:col-span-4 lg:col-span-3 xl:col-span-2"
        />
      </div>
    </template>
    <template v-else>
      <div
        v-if="count"
        class="mt-8 grid w-auto grid-cols-12 gap-4 xl:max-2xl:grid-cols-10"
        data-testid="wishlist-items-wrapper"
      >
        <ProductCard
          v-for="({ product, key }, index) in items"
          :id="product.id"
          :key="`product-${key}-${product}`"
          :index="index"
          :product="product"
          data-testid="wishlist-card"
          class="col-span-6 mb-4 sm:col-span-4 lg:col-span-3 xl:col-span-2"
        />
      </div>
      <div v-if="count === 0" class="mt-8 space-y-8">
        <EmptyState
          :title="$t('wishlist.no_items_info')"
          :description="$t('wishlist.continue_shopping_info')"
          icon="EmptyWishlist"
          show-default-actions
        />
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { defineOptions } from 'vue'
import { whenever } from '@vueuse/core'
import ProductCardSkeleton from '~/components/product/card/ProductCardSkeleton.vue'
import { useNuxtApp } from '#app/nuxt'
import { definePageMeta } from '#imports'
import { useWishlistTracking } from '~/composables'
import { useWishlist } from '#storefront/composables'
import EmptyState from '~/components/EmptyState.vue'
import ProductCard from '~/components/product/card/ProductCard.vue'
import { SFHeadline, SFFadeInTransition } from '#storefront-ui/components'

const { count, fetching, items, products } = useWishlist()
const { $i18n } = useNuxtApp()

const { trackWishlistPage } = useWishlistTracking()

// Track the wishlist once it is loaded
whenever(
  () => !fetching.value,
  () => {
    trackWishlistPage(products.value)
  },
  {
    once: true,
    immediate: true,
  },
)

useSeoMeta({
  robots: 'noindex,follow',
  title: $i18n.t('wishlist.meta.title'),
})

defineOptions({ name: 'WishlistPage' })
definePageMeta({ pageType: 'wishlist_page' })
</script>
