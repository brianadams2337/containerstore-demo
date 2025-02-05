<template>
  <div
    class="relative flex justify-center border-0 border-b border-gray-350 bg-secondary-450 px-5 py-2 text-center md:hidden"
  >
    <div
      class="absolute bottom-1/2 left-0 translate-y-1/2 cursor-pointer pl-5"
      @click="$router.go(-1)"
    >
      <IconBack class="size-3" />
    </div>
    <h1
      class="flex w-40 items-center justify-center py-1 text-sm font-semibold text-primary"
    >
      <component :is="icon" v-if="icon" class="mr-1 size-3" />
      <span>{{ title }}</span>
    </h1>
  </div>
</template>

<script setup lang="ts">
const { icon = '' } = defineProps<{
  title: string
  icon?: string
}>()
</script>
