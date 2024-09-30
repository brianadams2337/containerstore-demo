<template>
  <div class="w-full space-y-6">
    <SFSkeletonLoader />
    <SFSkeletonLoader
      v-for="index in formElementCount"
      :key="index"
      full-width
    />
    <div class="flex w-full justify-center pt-4">
      <SFSkeletonLoader />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'

defineProps<{ formElementCount: number }>()
</script>
