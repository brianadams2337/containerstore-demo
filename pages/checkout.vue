<template>
  <div id="ayCheckoutContainer" class="min-h-[85vh]">
    <ay-checkout
      v-if="accessToken && basketKey && showCheckout"
      ref="checkoutRef"
      :access-token="accessToken"
      :basket-id="basketKey"
      :campaign-key="campaignKey"
      header-element="#header"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import type { CheckoutEvent } from '@scayle/storefront-nuxt'
useCheckoutWebComponent()
const { data: basketData, fetch: fetchBasket, fetching } = await useBasket()

const { user, fetch: fetchUser } = await useUser()

const { $i18n } = useNuxtApp()

const log = useLog('CheckoutPage')

const { listenToCheckoutStepChanges } = useTrackingEvents()

listenToCheckoutStepChanges()

const basketKey = computed(() => basketData?.value?.key)
const checkoutRef = ref(null)
const { data: campaignKey, fetch: fetchCampaignKey } = await useCampaign()

const showCheckout = ref(false)
const accessToken = computed(() => {
  return user.value?.authentication?.storefrontAccessToken
})

const onCheckoutUpdate = async (
  event: MessageEvent<CheckoutEvent>,
  fetching: boolean,
  fetchCallback: () => Promise<void>,
) => {
  if (fetching) {
    return
  } // prevent multiple fetches
  if (event?.data?.type === 'tracking') {
    const actionType = event.data.event?.event

    if (actionType === 'add_to_cart' || actionType === 'remove_from_cart') {
      await fetchCallback()
    }
  }
}

// Refresh basket if the user changes quantity or removes an item at checkout
useEventListener('message', (event) =>
  onCheckoutUpdate(event, fetching.value, fetchBasket),
)

onMounted(async () => {
  try {
    await _retry({ times: 5, delay: 100 }, fetchCampaignKey)
  } catch (error: any) {
    log.error('[checkout.vue] Error getting campaign key', error)
  }
  showCheckout.value = true

  console.log(
    user.value?.authentication,
    accessToken.value,
    basketKey.value,
    showCheckout.value,
  )
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
  log.error('[onCheckoutError]', loggingPayload)
}

useSeoMeta({
  robots: 'index,follow',
  title: $i18n.t('navigation.checkout'),
})
defineOptions({ name: 'CheckoutPage' })
definePageMeta({ pageType: 'checkout' })
</script>
