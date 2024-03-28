<template>
  <PageContent>
    <subscription-overview
      v-if="isSubscriptionWebComponentLoaded"
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

const { isSubscriptionWebComponentLoaded, apiUrl } =
  useSubscriptionWebComponent()

const accessToken = computed(
  () => user?.value?.authentication?.storefrontAccessToken,
)

definePageMeta({ pageType: 'subscription' })
</script>
