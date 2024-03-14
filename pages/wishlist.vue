<template>
  <div class="container max-sm:max-w-none">
    <div class="mt-8">
      <Headline size="xl" class="font-semibold text-primary">
        {{ $t('wishlist.heading') }}
      </Headline>
      <p
        v-if="count !== undefined"
        data-test-id="wishlist-count"
        class="mt-4 text-xs font-semibold text-secondary"
      >
        {{ $t('wishlist.products_count', count) }}
      </p>
    </div>
    <template v-if="fetching">
      <div class="mt-8 flex flex-wrap">
        <SkeletonLoader
          v-for="index in count"
          :key="`product-loading-${index}`"
          type="custom"
          class="mb-40 mr-2 h-96 w-80"
        />
      </div>
    </template>
    <template v-else>
      <div v-if="count" class="mt-8 grid w-auto grid-cols-12 gap-2">
        <WishlistCard
          v-for="(item, index) in orderedItems"
          :key="`product-${item.key}-${item.product}`"
          v-bind="{ item, index }"
          data-test-id="wishlist-card"
          class="mb-4"
        />
      </div>
      <div v-if="count === 0" class="mt-8 space-y-8">
        <EmptyState
          :title="$t('wishlist.no_items_info')"
          :description="$t('wishlist.continue_shopping_info')"
          icon="IconEmptyWishlist"
          show-default-actions
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { count, fetching, orderedItems } = await useWishlistPage()

defineOptions({ name: 'WishlistPage' })
definePageMeta({ pageType: 'wishlist_page' })
</script>
