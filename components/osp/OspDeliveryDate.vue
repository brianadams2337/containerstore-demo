<template>
  <div class="hidden space-y-2 py-6 sm:block">
    <SFHeadline size="sm" tag="h2" is-uppercase class="mb-3">
      {{ $t('osp.estimated_deliver_date') }}
    </SFHeadline>
    <div class="text-gray-600">
      {{ formatDate(deliveryDate.minimum) }} -
      {{ formatDate(deliveryDate.maximum) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@scayle/storefront-nuxt'
import { SFHeadline } from '#storefront-ui/components'

defineProps<{ deliveryDate: DeliveryDate }>()
</script>
