<template>
  <div class="container mt-8 max-sm:max-w-none">
    <SFHeadline
      tag="h1"
      class="mt-1.5 !font-semi-bold-variable text-gray-900 max-sm:text-2xl max-sm:leading-6 sm:mt-0"
    >
      {{ $t('wishlist.heading') }}
      <ClientOnly>
        <SFFadeInTransition v-if="count !== undefined && count > 0" appear>
          <span
            class="ml-0.5 inline-flex h-4.5 items-center rounded-full bg-gray-900 px-2 text-xs font-semibold leading-4 text-white"
          >
            {{ count }}
          </span>
        </SFFadeInTransition>
      </ClientOnly>
    </SFHeadline>

    <SFAsyncDataWrapper :status="status">
      <div
        v-if="count"
        class="mt-8 grid w-auto grid-cols-12 gap-4 xl:max-2xl:grid-cols-10"
        data-testid="wishlist-items-wrapper"
      >
        <SFProductCard
          v-for="({ product, key }, index) in items"
          :id="product.id"
          :key="`product-${key}-${product}`"
          :index="index"
          :product="product"
          data-testid="wishlist-card"
          class="col-span-6 mb-4 sm:col-span-4 lg:col-span-3 xl:col-span-2"
        />
      </div>
      <SFEmptyState
        v-if="count === 0"
        :title="$t('wishlist.no_items_info')"
        :description="$t('wishlist.continue_shopping_info')"
        icon="EmptyWishlist"
      />

      <template #loading>
        <div
          class="mt-8 grid w-auto grid-cols-12 gap-4 xl:max-2xl:grid-cols-10"
        >
          <SFProductCardSkeleton
            v-for="index in 12"
            :key="`product-loading-${index}`"
            type="custom"
            class="col-span-6 mb-4 sm:col-span-4 lg:col-span-3 xl:col-span-2"
          />
        </div>
      </template>
    </SFAsyncDataWrapper>
  </div>
</template>

<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import { defineOptions } from 'vue'
import { whenever } from '@vueuse/core'
import { sanitizeCanonicalURL } from '@scayle/storefront-nuxt'
import SFProductCardSkeleton from '~/components/product/card/SFProductCardSkeleton.vue'
import SFAsyncDataWrapper from '~/components/SFAsyncDataWrapper.vue'
import { definePageMeta, useNuxtApp, useRoute } from '#imports'
import { useWishlistTracking } from '~/composables'
import { useWishlist } from '#storefront/composables'
import SFEmptyState from '~/components/SFEmptyState.vue'
import SFProductCard from '~/components/product/card/SFProductCard.vue'
import { SFHeadline, SFFadeInTransition } from '#storefront-ui/components'
import { ClientOnly } from '#components'
import { useI18n } from '#i18n'

const { count, status, items, products } = useWishlist()

const { t } = useI18n()

const { trackWishlistPage } = useWishlistTracking()

// Track the wishlist once it is loaded
whenever(
  () => status.value !== 'pending',
  () => trackWishlistPage(products.value),
  { once: true, immediate: true },
)

const {
  $config: {
    public: { baseUrl },
  },
} = useNuxtApp()
useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('wishlist.meta.title'),
  description: t('wishlist.meta.description'),
})

const route = useRoute()
useHead({
  link: [
    {
      rel: 'canonical',
      key: 'canonical',
      href: sanitizeCanonicalURL(`${baseUrl}${route?.fullPath}`),
    },
  ],
})
defineOptions({ name: 'WishlistPage' })
definePageMeta({ pageType: 'wishlist_page' })
</script>
