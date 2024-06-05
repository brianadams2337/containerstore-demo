<template>
  <PageContent>
    <subscription-cancellation
      v-if="isSubscriptionCancellationWebComponentLoaded"
      :base-url="apiUrl"
      :shop-id="shopId"
    />
  </PageContent>
</template>

<script setup lang="ts">
import useSubscriptionWebComponent from '../composables/useSubscriptionWebComponent'
import { definePageMeta } from '#imports'
import { useCurrentShop } from '#storefront/composables'

const currentShop = useCurrentShop()
const shopId = currentShop.value.shopId

const {
  apiUrl,
  isSubscriptionCancellationWebComponentLoaded,
  loadCancellationPage,
} = useSubscriptionWebComponent()

loadCancellationPage()

definePageMeta({ pageType: 'subscription-cancellation' })
</script>
