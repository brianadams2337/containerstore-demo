<template>
  <SFAsyncDataWrapper :status="status">
    <SFOrderDetailHeadline :id="id" class="mb-5 xl:mb-7" />
    <template v-if="orderDetails">
      <SFOrderDetailBaseInformation
        :order-details="orderDetails"
        class="mb-4"
      />
      <SFOrderDetailProductList :order-details="orderDetails" />
      <SFOrderDetailPaymentSummary :cost="orderDetails.cost" />
    </template>
    <template #loading>
      <SFOrderDetailSkeletonLoader />
    </template>
  </SFAsyncDataWrapper>
</template>

<script setup lang="ts">
import { computed, defineOptions, onMounted, onServerPrefetch } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { HttpStatusCode } from '@scayle/storefront-nuxt'
import { definePageMeta } from '#imports'
import { useRoute } from '#app/composables/router'
import SFAsyncDataWrapper from '~/components/SFAsyncDataWrapper.vue'
import SFOrderDetailSkeletonLoader from '~/components/order/detail/SFOrderDetailSkeletonLoader.vue'
import SFOrderDetailBaseInformation from '~/components/order/detail/SFOrderDetailBaseInformation.vue'
import SFOrderDetailHeadline from '~/components/order/detail/SFOrderDetailHeadline.vue'
import SFOrderDetailProductList from '~/components/order/detail/SFOrderDetailProductList.vue'
import { useOrder } from '#storefront/composables'
import type { OrderProduct, OrderVariant } from '~/types/order'
import { createError } from '#app/composables/error'
import { useI18n } from '#i18n'
import SFOrderDetailPaymentSummary from '~/components/order/detail/SFOrderDetailPaymentSummary.vue'

const { t } = useI18n()

const route = useRoute()
const id = computed(() => +route.params.id)

const orderPromise = useOrder<OrderProduct, OrderVariant>(
  { params: { orderId: id.value } },
  `orderId-${id.value}`,
)

const { data: orderDetails, status, error } = orderPromise

const validateOrderExists = async () => {
  await orderPromise

  if (error.value || (status.value !== 'pending' && !orderDetails.value)) {
    throw createError({ statusCode: HttpStatusCode.NOT_FOUND, fatal: true })
  }
}

onServerPrefetch(validateOrderExists)
onMounted(validateOrderExists)

useSeoMeta({
  robots: 'noindex, nofollow',
  title: () => t('my_account.orders.detail.meta.title', { id: id.value }),
  description: () =>
    t('my_account.orders.detail.meta.description', { id: id.value }),
})

defineOptions({ name: 'OrderDetailsView' })
definePageMeta({ pageType: 'account_area:order_id' })
</script>
