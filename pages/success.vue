<template>
  <SFPageContainer>
    <div v-if="fetching" class="container flex gap-2">
      <ProductCardSkeleton v-for="index in 2" :key="`osp-loading-${index}`" />
    </div>
    <div v-if="orderData" class="px-6 sm:mx-auto sm:flex sm:flex-wrap md:px-0">
      <OspBasicDataSection
        :order-data="orderData"
        :delivery-date="deliveryDate"
      />
      <OspSummarySection
        :order-data="orderData"
        :delivery-date="deliveryDate"
      />
    </div>
    <EmptyState v-else :title="$t('osp.no_order_found')" show-default-actions />
  </SFPageContainer>
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted, watch } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useNuxtApp } from '#app'
import { useOrderConfirmation, useUser } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import EmptyState from '~/components/EmptyState.vue'
import ProductCardSkeleton from '~/components/product/card/ProductCardSkeleton.vue'
import OspBasicDataSection from '~/components/osp/OspBasicDataSection.vue'
import OspSummarySection from '~/components/osp/OspSummarySection.vue'
import { SFPageContainer } from '#storefront-ui/components'

const route = useRoute()
const cbdToken = String(route.query.cbd)

const { data: orderData, fetching } = await useOrderConfirmation<
  OrderProduct,
  OrderVariant
>({
  params: { cbdToken },
  options: { lazy: true },
})

const user = await useUser()

const { $i18n } = useNuxtApp()

const { trackPurchaseEvent } = useTrackingEvents()

if (import.meta.client && user.isLoggedIn) {
  await user.forceRefresh()
}

onMounted(() => {
  watch(
    fetching,
    (isFetching) => {
      if (!isFetching && orderData.value) {
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

useSeoMeta({
  robots: 'index,follow',
  title: $i18n.t('navigation.osp'),
})

defineOptions({ name: 'OrderSuccessPage' })
definePageMeta({ pageType: 'osp' })
</script>
