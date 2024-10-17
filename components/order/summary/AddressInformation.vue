<template>
  <div>
    <p
      v-for="(formattedAddress, index) in getFormattedLocaleAddresses(address)"
      :key="index"
    >
      {{ formattedAddress }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { getFormattedLocaleAddresses } from '~/utils'
import type { OrderAddress } from '~/types/order'

defineProps<{ address: OrderAddress }>()
</script>
