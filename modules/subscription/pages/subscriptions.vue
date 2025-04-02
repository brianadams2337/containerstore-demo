<template>
  <div>
    <SFHeadline
      class="mb-5 !font-semi-bold-variable xl:mb-7"
      tag="h2"
      data-testid="subscriptions-headline"
    >
      {{ $t('subscription.headline') }}
    </SFHeadline>
    <subscription-overview
      v-if="isSubscriptionOverviewWebComponentLoaded && accessToken"
      :base-url="apiUrl"
      :customer-token="accessToken"
      :shop-id="shopId"
    />
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { defineOptions, onMounted } from 'vue'
import useSubscriptionWebComponent from '../composables/useSubscriptionWebComponent'
import { useCurrentShop } from '#storefront/composables'
import { definePageMeta } from '#imports'
import { SFHeadline } from '#storefront-ui/components'

const currentShop = useCurrentShop()
const shopId = currentShop.value.shopId

const {
  isSubscriptionOverviewWebComponentLoaded,
  apiUrl,
  loadOverviewPage,
  accessToken,
} = useSubscriptionWebComponent()

onMounted(() => loadOverviewPage())

const { t } = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('subscription.meta.title'),
  description: t('subscription.meta.description'),
})

definePageMeta({ pageType: 'subscription' })
defineOptions({ name: 'SubscriptionPage' })
</script>
