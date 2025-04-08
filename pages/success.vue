<template>
  <div class="-mb-16 max-lg:border-t">
    <SFAsyncDataWrapper :status="status">
      <div v-if="orderData" class="relative flex flex-col md:flex-row">
        <SFOspSummarySection
          :order-data="orderData"
          :delivery-date="deliveryDate"
          class="order-2"
        />
        <SFOspBasicDataSection
          :order-data="orderData"
          :delivery-date="deliveryDate"
          class="order-1"
        />
        <SFOspCtaButtons
          :order-data="orderData"
          class="order-3 bg-gray-50 px-5 py-4 md:hidden"
        />
      </div>
      <SFEmptyState
        v-else
        :title="$t('osp.no_order_found.title')"
        :description="$t('osp.no_order_found.description')"
        :show-default-actions="false"
      >
        <SFButton
          variant="tertiary"
          :to="getLocalizedRoute(routeList.home)"
          class="mt-10"
        >
          {{ $t('global.continue_shopping_label') }}
        </SFButton>
      </SFEmptyState>
      <template #loading>
        <SFOspSkeleton />
      </template>
    </SFAsyncDataWrapper>
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted, watch } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useOrderConfirmation, useUser } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import SFAsyncDataWrapper from '~/components/SFAsyncDataWrapper.vue'
import SFEmptyState from '~/components/SFEmptyState.vue'
import SFOspBasicDataSection from '~/components/osp/SFOspBasicDataSection.vue'
import SFOspSummarySection from '~/components/osp/SFOspSummarySection.vue'
import SFOspCtaButtons from '~/components/osp/SFOspCtaButtons.vue'
import SFOspSkeleton from '~/components/osp/SFOspSkeleton.vue'
import type { OrderProduct, OrderVariant } from '~/types/order'
import { useI18n } from '#i18n'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { SFButton } from '#storefront-ui/components'
import { routeList } from '~/utils/route'

const { getLocalizedRoute } = useRouteHelpers()

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

useSeoMeta({
  robots: 'noindex,nofollow',
  title: () =>
    status.value === 'error'
      ? t('osp.no_order_found.title')
      : t('osp.meta.title'),
  description: () =>
    status.value === 'error'
      ? t('osp.no_order_found.description')
      : t('osp.meta.description'),
})

defineOptions({ name: 'OrderSuccessPage' })
definePageMeta({ pageType: 'osp' })
</script>
