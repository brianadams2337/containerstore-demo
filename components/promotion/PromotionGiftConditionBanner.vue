<template>
  <div
    class="flex items-center justify-between gap-y-[.125rem] rounded-md px-4 py-2 text-white md:items-center lg:flex-nowrap"
    :style="{ backgroundColor }"
  >
    <Headline
      size="xs"
      is-bold
      class="text-balance md:basis-1/2 lg:basis-5/12 xl:basis-7/12"
      >{{ label }}</Headline
    >
    <PromotionCountdown
      :until="scheduleTo"
      borderless
      class="md:basis-1/2 md:items-center md:justify-end lg:basis-7/12 xl:basis-5/12"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  backgroundColor: string
  label: string
  scheduleTo: string
}>()
</script>
