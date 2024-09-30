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

type Props = {
  id: Order['id']
  customer?: Order['customer']
  confirmedAt?: Order['confirmedAt']
}
const props = defineProps<Props>()

const currentShop = useCurrentShop()

const orderConfirmedAt = computed(() => {
  if (!props.confirmedAt) {
    return
  }
  const locale = currentShop.value?.locale?.replace('_', '-')
  return props.confirmedAt
    ? new Date(props.confirmedAt).toLocaleDateString(locale)
    : null
})
</script>
