<template>
  <div
    v-if="hasSubscriptionData"
    class="overflow-hidden border-gray-200 max-lg:rounded-lg max-lg:border"
  >
    <div
      class="border-gray-200 px-4 py-2.5 text-base font-semi-bold-variable text-gray-900 max-lg:border-b max-lg:bg-gray-50 lg:pl-0 lg:text-sm"
      data-testid="main-label"
    >
      {{ $t('subscription.title') }}:
    </div>
    <div class="space-y-2 px-4 py-2.5 lg:pl-0 lg:pt-0">
      <div
        v-for="attribute in subscriptionAttributes"
        :key="attribute.label"
        class="flex gap-1"
      >
        <div
          class="text-base font-semi-bold-variable leading-none text-gray-600 lg:text-sm"
          data-testid="main-label"
        >
          {{ attribute.label }}:
        </div>
        <div
          class="text-base font-normal leading-none text-gray-600 lg:text-sm"
          data-testid="sub-label"
        >
          {{ attribute.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-core'
import useBasketSubscription from '../composables/useBasketSubscription'

const { basketItem } = defineProps<{
  basketItem: BasketItem
}>()

const { hasSubscriptionData, subscriptionAttributes } =
  useBasketSubscription(basketItem)
</script>
