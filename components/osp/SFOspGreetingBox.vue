<template>
  <div class="flex flex-col items-center gap-2 rounded-xl bg-emerald-100 p-5">
    <div
      class="mb-2 w-fit rounded-full border-2 border-gray-900 bg-white p-1.5"
    >
      <IconCheckmark class="size-6" />
    </div>
    <SFHeadline size="lg" class="flex items-center">
      {{ $t('osp.intro') }}
    </SFHeadline>
    <p class="text-sm text-gray-600">{{ $t('osp.email_send') }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~/types/order'
import { SFHeadline } from '#storefront-ui/components'

defineProps<{
  orderData: Order
}>()
</script>
