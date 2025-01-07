<template>
  <div class="col-span-6 w-full md:col-span-4 lg:col-span-3 lg:max-w-[23rem]">
    <SFSkeletonLoader
      type="custom"
      class="mb-5 min-h-96 rounded-lg bg-gray-200 md:min-h-56 lg:min-h-80"
    />
    <SFSkeletonLoader
      type="custom"
      class="mb-1 h-3 max-w-[6.5rem] rounded-lg bg-gray-200"
    />
    <SFSkeletonLoader
      type="custom"
      class="mb-5 h-3 max-w-[12.875rem] rounded-lg bg-gray-200"
    />
    <SFSkeletonLoader
      type="custom"
      class="h-4 max-w-20 rounded-lg bg-gray-200"
    />
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
