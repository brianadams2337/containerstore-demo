<template>
  <PageContent>
    <!-- eslint-disable-next-line vue/no-undef-components -->
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
// TODO: This needs to be decoupled from the Subscription module as it is coming from the SFB local components
import PageContent from '~/components/layout/PageContent.vue'

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
