<template>
  <div>
    <SFHeadline size="sm" tag="h2" is-uppercase class="mb-3">
      {{ $t('osp.order_data') }}
    </SFHeadline>
    <p v-if="orderConfirmedAt">
      <b>{{ $t('osp.order_date') }}:</b>
      {{ orderConfirmedAt }}
    </p>
    <p v-if="id">
      <b>{{ $t('osp.order_nr') }}:</b> {{ id }}
    </p>
    <p v-if="customer">
      <b>{{ $t('osp.customer_id') }}:</b>
      {{ customer.id }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentShop } from '#storefront/composables'
import { SFHeadline } from '#storefront-ui/components'
import type { Order } from '~/types/order'

const { confirmedAt } = defineProps<{
  id: Order['id']
  customer?: Order['customer']
  confirmedAt?: Order['confirmedAt']
}>()

const currentShop = useCurrentShop()

const orderConfirmedAt = computed(() => {
  if (!confirmedAt) {
    return
  }
  return new Date(confirmedAt).toLocaleDateString(
    currentShop.value?.locale?.replace('_', '-'),
  )
})
</script>
