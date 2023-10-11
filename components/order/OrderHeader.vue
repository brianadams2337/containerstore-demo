<template>
  <div class="bg-white pb-4 pt-5">
    <Headline class="mb-4 break-all" tag="h2" size="xl">
      {{ headline }}
    </Headline>
    <p class="break-all font-semibold text-secondary">
      <span>{{ shopId }} - {{ orderId }}</span>
      <span>{{ ' · ' }}</span>
      <span>{{
        $t('my_account.orders.item_count', { count: itemCount })
      }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  orderId: {
    type: Number,
    required: true,
  },
  shopId: {
    type: Number,
    required: true,
  },
  itemCount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: String,
    required: true,
  },
})

const { $i18n } = useNuxtApp()

const headline = computed(() => {
  const date = localeFormattedDate(props.orderDate)
  return $i18n.t('my_account.orders.order_summary_header', { date })
})
</script>
