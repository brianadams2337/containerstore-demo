<template>
  <div class="flex flex-col">
    <p
      data-testid="product-card-product-brand"
      class="mb-2.5 truncate text-base font-semi-bold-variable text-gray-900"
    >
      {{ brand }}
    </p>
    <p
      data-testid="product-card-product-name"
      class="truncate text-sm text-gray-600"
    >
      {{ name }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ brand: string; name: string }>()
</script>
