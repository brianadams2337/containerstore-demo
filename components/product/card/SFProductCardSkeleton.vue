<template>
  <div class="col-span-6 mb-5 w-full lg:col-span-4 xl:col-span-3">
    <SFSkeletonLoader
      type="custom"
      class="mb-2 aspect-3/4 rounded-lg bg-gray-200 md:mb-3"
    />

    <SFSkeletonLoader type="custom" class="mb-3 size-12 rounded-md md:hidden" />

    <SFSkeletonLoader
      type="custom"
      class="mb-3 h-3 max-w-[6.5rem] rounded-lg bg-gray-200"
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
