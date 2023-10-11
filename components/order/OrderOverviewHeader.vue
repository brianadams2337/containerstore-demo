<template>
  <div class="hidden bg-white pb-4 pt-3 md:block">
    <div class="hidden bg-white pb-4 pt-5 md:block">
      <Headline class="mb-4 break-all" tag="h2" size="xl">
        {{ $t('my_account.orders.overview') }}
      </Headline>
      <p class="break-all font-semibold text-secondary">
        {{ $t('my_account.orders_count', ordersCount) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  ordersCount: {
    type: Number,
    default: 0,
  },
})
</script>
