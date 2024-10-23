<template>
  <SFPageContainer>
    <subscription-overview
      v-if="isSubscriptionOverviewWebComponentLoaded && accessToken"
      :base-url="apiUrl"
      :customer-token="accessToken"
      :shop-id="shopId"
    />
  </SFPageContainer>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { defineOptions, onMounted } from 'vue'
import useSubscriptionWebComponent from '../composables/useSubscriptionWebComponent'
import { useCurrentShop } from '#storefront/composables'
import { definePageMeta } from '#imports'
import { SFPageContainer } from '#storefront-ui/components'

const currentShop = useCurrentShop()
const shopId = currentShop.value.shopId

const {
  isSubscriptionOverviewWebComponentLoaded,
  apiUrl,
  loadOverviewPage,
  accessToken,
} = useSubscriptionWebComponent()

onMounted(() => loadOverviewPage())

const i18n = useI18n()
useHead({
  titleTemplate: (pageTitle) => pageTitle ?? null,
  title: i18n.t('subscription.page_title'),
})

definePageMeta({ pageType: 'subscription' })
defineOptions({ name: 'SubscriptionPage' })
</script>
