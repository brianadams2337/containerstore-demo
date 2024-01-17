<template>
  <div class="hidden bg-white pb-4 md:block">
    <Headline class="mb-4 break-all" tag="h2" size="xl">
      {{ $t('my_account.orders.overview') }}
    </Headline>
    <p class="break-all font-semibold text-secondary">
      {{ $t('my_account.orders_count', ordersCount) }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ ordersCount: number }>(), { ordersCount: 0 })
</script>
