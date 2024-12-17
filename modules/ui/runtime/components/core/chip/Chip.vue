<template>
  <div class="group relative">
    <input
      v-model="model"
      :value="item"
      class="peer absolute size-full cursor-pointer appearance-none rounded-lg"
      type="checkbox"
      data-testid="checkbox-chip"
    />
    <div
      class="flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-gray-500 outline outline-1 outline-gray-400 group-hover:outline-2 group-hover:outline-accent peer-checked:bg-accent peer-checked:text-white peer-checked:outline-accent"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
defineProps<{ item: T }>()

const model = defineModel<T[]>()
</script>
