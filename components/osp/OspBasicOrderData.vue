<template>
  <div>
    <Headline size="sm" tag="h2" type="loud" class="mb-3">
      {{ $t('osp.order_data') }}
    </Headline>
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
const props = defineProps({
  id: {
    type: Number as PropType<Order['id']>,
    default: undefined,
  },
  customer: {
    type: Object as PropType<Order['customer']>,
    default: undefined,
  },
  confirmedAt: {
    type: String as PropType<Order['confirmedAt']>,
    default: undefined,
  },
})

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
