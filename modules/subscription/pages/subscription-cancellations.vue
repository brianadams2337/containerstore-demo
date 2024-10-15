<template>
  <SFPageContainer>
    <!-- eslint-disable-next-line vue/no-undef-components -->
    <subscription-cancellation
      v-if="isSubscriptionCancellationWebComponentLoaded"
      :base-url="apiUrl"
      :shop-id="shopId"
    />
  </SFPageContainer>
</template>

<script setup lang="ts">
import useSubscriptionWebComponent from '../composables/useSubscriptionWebComponent'
import { definePageMeta } from '#imports'
import { useCurrentShop } from '#storefront/composables'
import { SFPageContainer } from '#storefront-ui/components'

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
