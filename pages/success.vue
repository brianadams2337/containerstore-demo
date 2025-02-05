<template>
  <SFPageContainer>
    <div v-if="status === 'pending'" class="container flex gap-2">
      <SFProductCardSkeleton v-for="index in 2" :key="`osp-loading-${index}`" />
    </div>
    <div v-if="orderData" class="px-6 sm:mx-auto sm:flex sm:flex-wrap md:px-0">
      <SFOspBasicDataSection
        :order-data="orderData"
        :delivery-date="deliveryDate"
      />
      <SFOspSummarySection
        :order-data="orderData"
        :delivery-date="deliveryDate"
      />
    </div>
    <SFEmptyState v-else :title="$t('osp.no_order_found')" />
  </SFPageContainer>
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted, watch } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useOrderConfirmation, useUser } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import SFEmptyState from '~/components/SFEmptyState.vue'
import SFProductCardSkeleton from '~/components/product/card/SFProductCardSkeleton.vue'
import SFOspBasicDataSection from '~/components/osp/SFOspBasicDataSection.vue'
import SFOspSummarySection from '~/components/osp/SFOspSummarySection.vue'
import { SFPageContainer } from '#storefront-ui/components'
import type { OrderProduct, OrderVariant } from '~/types/order'
import { useI18n } from '#i18n'

const route = useRoute()
const cbdToken = String(route.query.cbd)

const { data: orderData, status } = await useOrderConfirmation<
  OrderProduct,
  OrderVariant
>({
  params: { cbdToken },
  options: { lazy: true },
})

const user = await useUser()

const { t } = useI18n()

const { trackPurchaseEvent } = useTrackingEvents()

if (import.meta.client && user.isLoggedIn) {
  await user.forceRefresh()
}

onMounted(() => {
  watch(
    status,
    (newStatus) => {
      if (newStatus !== 'pending' && orderData.value) {
        trackPurchaseEvent(orderData.value)
      }
    },
    { immediate: true },
  )
})

const deliveryDate = computed(() => {
  const [pkg] = orderData.value?.packages ?? []
  return pkg?.deliveryDate
})

useSeoMeta({ robots: 'index,follow', title: t('navigation.osp') })

defineOptions({ name: 'OrderSuccessPage' })
definePageMeta({ pageType: 'osp' })
</script>
