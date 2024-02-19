<template>
  <div class="relative">
    <div class="h-[calc(100vh-220px)] w-full">
      <StoreLocatorMap
        :api-key="googleMapsKey"/>
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const googleMapsKey = config.public.googleMapsApiKey
</script>
