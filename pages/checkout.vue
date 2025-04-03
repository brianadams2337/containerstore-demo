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
import {
  useCheckoutWebComponent,
  useCheckoutStepTrackingInterceptor,
} from '~/composables'
import { useBasket, useLog, useUser } from '#storefront/composables'
import { useI18n } from '#i18n'
import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'

const { accessToken, checkoutJwt, fetchCheckoutToken } =
  useCheckoutWebComponent()
const { refresh: refreshBasket, status, data: basket } = useBasket()
const { applyPromotions } = useApplyPromotions()

const { user, refresh: refreshUser } = useUser()

const { t } = useI18n()

const log = useLog('CheckoutPage')

useCheckoutStepTrackingInterceptor()

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
      // Update promotions in case some got applicable after the cart was updated
      await applyPromotions(basket)
    }
  }
}

// Refresh basket if the user changes quantity or removes an item at checkout
useEventListener('message', (event) =>
  onCheckoutUpdate(event, status.value === 'pending', refreshBasket),
)

onBeforeMount(async () => {
  await Promise.all([refreshBasket(), refreshUser(), fetchCheckoutToken()])
  await applyPromotions(basket)
})

const handleError = (payload = {}) => {
  console.error('Checkout web component ran into an error: ', payload)
  const loggingPayload = JSON.stringify({
    userId: user.value?.id,
    checkoutJwt,
  })
  log.error('[onCheckoutError]', loggingPayload)
}

useSeoMeta({ robots: 'index,follow', title: t('navigation.checkout') })

defineOptions({ name: 'CheckoutPage' })
definePageMeta({ pageType: 'checkout', layout: 'simple' })
</script>
