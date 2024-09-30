<template>
  <div class="flex h-full py-2">
    <div class="flex-1 space-y-2">
      <div v-for="n in 3" :key="n" class="mt-6 flex items-center">
        <SFSkeletonLoader class="h-16" full-width type="headline" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
