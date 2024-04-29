<template>
  <PageContent>
    <subscription-overview
      v-if="isSubscriptionOverviewWebComponentLoaded"
      :base-url="apiUrl"
      :customer-token="accessToken"
      :shop-id="shopId"
    />
  </PageContent>
</template>

<script setup lang="ts">
const currentShop = useCurrentShop()
const shopId = currentShop.value.shopId

const { user } = await useUser()

const { isSubscriptionOverviewWebComponentLoaded, apiUrl, loadOverviewPage } =
  useSubscriptionWebComponent()

onMounted(() => loadOverviewPage())

const accessToken = computed(
  () => user?.value?.authentication?.storefrontAccessToken,
)

definePageMeta({ pageType: 'subscription' })
defineOptions({ name: 'SubscriptionPage' })
</script>
