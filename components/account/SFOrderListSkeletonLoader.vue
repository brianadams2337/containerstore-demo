<template>
  <SFSkeletonLoader type="custom" class="mb-3 h-6" />
  <SFSkeletonLoader type="custom" class="mb-4 h-6" />
  <SFSkeletonLoader
    v-for="i in ordersPerPage"
    :key="i"
    full-width
    type="custom"
    class="h-[86px] first:rounded-md last:rounded-md"
  />
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'

defineProps<{ ordersPerPage: number }>()
</script>
