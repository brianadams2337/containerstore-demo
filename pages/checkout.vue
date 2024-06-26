<template>
  <div id="ayCheckoutContainer" class="min-h-[85vh]">
    <scayle-checkout
      v-if="accessToken && checkoutJwt"
      ref="checkoutRef"
      :access-token="accessToken"
      :jwt="checkoutJwt"
      header-element="#header"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { defineOptions, onBeforeMount, ref } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { useEventListener } from '@vueuse/core'
import type { CheckoutEvent } from '@scayle/storefront-nuxt'
import { definePageMeta } from '#imports'
import { useCheckoutWebComponent, useTrackingEvents } from '~/composables'
import { useBasket, useLog, useUser } from '#storefront/composables'
import { useNuxtApp } from '#app/nuxt'

const { accessToken, checkoutJwt, fetchCheckoutToken } =
  await useCheckoutWebComponent()
const { fetch: fetchBasket, fetching } = useBasket()

const { user, fetch: fetchUser } = useUser()

const { $i18n } = useNuxtApp()

const log = useLog('CheckoutPage')

const { listenToCheckoutStepChanges } = useTrackingEvents()

listenToCheckoutStepChanges()

const checkoutRef = ref(null)

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

onBeforeMount(async () => {
  await Promise.all([fetchBasket(), fetchUser(), fetchCheckoutToken()])
})

const handleError = (payload = {}) => {
  console.error('Checkout web component ran into an error: ', payload)
  const loggingPayload = JSON.stringify({
    userId: user.value?.id,
    checkoutJwt,
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
