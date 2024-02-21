<template>
  <div class="relative">
    <div class="h-[calc(100vh-220px)] w-full">
      <StoreLocatorMap :stores="storesData" :api-key="googleMapsKey" />
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const googleMapsKey = config.public.googleMapsApiKey
const { storesData, refreshStores } = useStoreLocator()

// TODO: change defaults
const searchAddress = ref('20095')
const searchRadius = ref(5000)

onMounted(() =>
  refreshStores({
    filters: { address: searchAddress.value, radius: searchRadius.value },
  }),
)
</script>
