<template>
  <AuthGuard>
    <div id="ayCheckoutContainer" class="min-h-[85vh]">
      <ay-checkout
        v-if="accessToken && basketKey && showCheckout"
        ref="checkoutRef"
        :access-token="accessToken"
        :basket-id="basketKey"
        :campaign-key="campaignKey"
        header-element="#header"
        @error="handleError" />
    </div>
  </AuthGuard>
</template>

<script setup lang="ts">
useCheckoutWebComponent()
const { data: basketData, fetch: fetchBasket } = await useBasket(undefined, {
  autoFetch: true,
})
const { user, fetch: fetchUser } = await useUser({ autoFetch: true })

const { logger } = useLog('CheckoutPage')
// TODO tracking
// const { listenToCheckoutStepChanges } = useTrackingEvents()
// listenToCheckoutStepChanges()
const basketKey = computed(() => basketData?.value?.key)
const checkoutRef = ref(null)
const { data: campaignKey, fetch: fetchCampaignKey } = await useCampaign()

const showCheckout = ref(false)
const accessToken = computed(
  () => user.value?.authentication?.storefrontAccessToken,
)

onMounted(async () => {
  try {
    await useRetry({ times: 5, delay: 100 }, fetchCampaignKey)
  } catch (error: any) {
    logger({
      message: `[checkout.vue] Error at getting campaign key`,
      level: 'error',
      extras: error,
    })
  }
  showCheckout.value = true
})

onBeforeMount(async () => {
  await Promise.all([fetchBasket(), fetchUser()])
})

const handleError = (payload = {}) => {
  console.error('Checkout web component ran into an error: ', payload)
  const loggingPayload = JSON.stringify({
    userId: user.value?.id,
    basketKey: basketKey.value,
  })
  logger({
    message: ` [onCheckoutError]`,
    level: 'error',
    extras: loggingPayload,
  })
}
</script>
<script lang="ts">
export default {
  name: 'CheckoutPage',
}
</script>
