<template>
  <div>
    <!-- order date + address -->
    <div class="bg-white p-8">
      <SkeletonLoader key="headline-loading" type="headline" is-full-width />
    </div>
    <div class="space-x-2 py-4">
      <div class="bg-white p-8">
        <!-- order items detail -->
        <div class="space-y-2">
          <SkeletonLoader
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
        <SkeletonLoader key="payment-loading" type="headline" is-full-width />
      </div>
      <div class="w-1/2 bg-white p-8">
        <SkeletonLoader key="pricing-loading" type="headline" is-full-width />
      </div>
    </div>
  </div>
</template>
