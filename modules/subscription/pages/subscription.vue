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
// TODO: This needs to be decoupled from the Subscription module as it is coming from the SFB local components
import PageContent from '~/components/layout/PageContent.vue'

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
