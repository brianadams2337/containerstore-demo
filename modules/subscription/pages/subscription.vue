<template>
  <PageContent>
    <subscription-overview
      v-if="isSubscriptionOverviewWebComponentLoaded && accessToken"
      :base-url="apiUrl"
      :customer-token="accessToken"
      :shop-id="shopId"
    />
  </PageContent>
</template>

<script setup lang="ts">
import { defineOptions, onMounted } from 'vue'
import useSubscriptionWebComponent from '../composables/useSubscriptionWebComponent'
import { useCurrentShop } from '#storefront/composables'
import { definePageMeta } from '#imports'

const currentShop = useCurrentShop()
const shopId = currentShop.value.shopId

const {
  isSubscriptionOverviewWebComponentLoaded,
  apiUrl,
  loadOverviewPage,
  accessToken,
} = useSubscriptionWebComponent()

onMounted(() => loadOverviewPage())

definePageMeta({ pageType: 'subscription' })
defineOptions({ name: 'SubscriptionPage' })
</script>
