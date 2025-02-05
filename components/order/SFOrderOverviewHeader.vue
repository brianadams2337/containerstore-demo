<template>
  <div class="hidden bg-white pb-4 md:block">
    <SFHeadline class="mb-4 break-all" tag="h1" size="xl">
      {{ $t('my_account.orders.overview') }}
    </SFHeadline>
    <h2 class="break-all font-semibold text-secondary">
      {{ $t('my_account.orders_count', ordersCount) }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { SFHeadline } from '#storefront-ui/components'

const { ordersCount = 0 } = defineProps<{ ordersCount: number }>()
</script>
