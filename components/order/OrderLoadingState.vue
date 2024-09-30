<template>
  <div>
    <!-- order date + address -->
    <div class="bg-white p-8">
      <SFSkeletonLoader key="headline-loading" type="headline" is-full-width />
    </div>
    <div class="space-x-2 py-4">
      <div class="bg-white p-8">
        <!-- order items detail -->
        <div class="space-y-2">
          <SFSkeletonLoader
            v-for="index in 3"
            :key="`image-loading-${index}`"
            type="headline"
            is-full-width
          />
        </div>
      </div>
    </div>
    <div class="flex space-x-2">
      <div class="w-1/2 bg-white p-8">
        <SFSkeletonLoader key="payment-loading" type="headline" is-full-width />
      </div>
      <div class="w-1/2 bg-white p-8">
        <SFSkeletonLoader key="pricing-loading" type="headline" is-full-width />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
