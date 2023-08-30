<template>
  <select v-model="path">
    <option
      v-for="shop in availableShops"
      :key="shop.shopId"
      :value="shop.path">
      {{ shop.locale }}
    </option>
  </select>
</template>

<script setup lang="ts">
const currentShop = useCurrentShop()
const availableShops = useAvailableShops()
const switchLocalePath = useSwitchLocalePath()

const path = computed({
  get: () => currentShop.value?.path,
  set: (newVal) => window.location.replace(switchLocalePath(newVal)),
})
</script>
