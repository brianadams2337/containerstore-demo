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
import { definePageMeta, useHead, useI18n } from '#imports'
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

const i18n = useI18n()
useHead({
  titleTemplate: (pageTitle) => pageTitle ?? null,
  title: i18n.t('subscription.page_title'),
})

definePageMeta({ pageType: 'subscription-cancellation' })
</script>
