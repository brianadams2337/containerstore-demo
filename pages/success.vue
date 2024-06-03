<template>
  <PageContent>
    <div v-if="fetching" class="container flex gap-2">
      <ProductCardSkeleton v-for="index in 2" :key="`osp-loading-${index}`" />
    </div>
    <div v-if="orderData" class="px-6 sm:mx-auto sm:flex sm:flex-wrap md:px-0">
      <OspBasicDataSection v-bind="{ orderData, deliveryDate }" />
      <OspSummarySection v-bind="{ orderData, deliveryDate }" />
    </div>
    <EmptyState v-else :title="$t('osp.no_order_found')" show-default-actions />
  </PageContent>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { computed, defineOptions, onMounted, watch } from 'vue'
import { definePageMeta } from '#imports'
import { useTrackingEvents } from '~/composables'
import { useNuxtApp } from '#app/nuxt'
import { useOrderConfirmation, useUser } from '#storefront/composables'
import { useRoute } from '#app/composables/router'

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

watch(
  user.fetching,
  async (isFetching) => {
    if (!isFetching && user.isLoggedIn) {
      // This will force fetching fresh user data from the backend.
      // Without it the new order will not be available in the users order list,
      // which will cause the oder not being displayed in the MyAccount area.
      await user.forceRefresh()
    }
  },
  { immediate: true },
)

const deliveryDate = computed(() => {
  const [pkg] = orderData.value.packages || []
  return pkg?.deliveryDate
})

useSeoMeta({
  robots: 'index,follow',
  title: $i18n.t('navigation.osp'),
})

defineOptions({ name: 'OrderSuccessPage' })
definePageMeta({ pageType: 'osp' })
</script>
