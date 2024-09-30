<template>
  <div class="z-10 flex flex-col py-4 md:flex-row md:py-10">
    <div class="md:w-1/2" :class="{ 'max-sm:mb-4': open }">
      <div
        class="flex w-full cursor-pointer gap-4 max-md:justify-between md:h-min md:flex-row-reverse md:justify-end"
        @click="open = !open"
      >
        {{ title }}
        <IconPlus v-if="!open" class="size-6 text-black" />
        <IconMinus v-else class="size-6 text-black" />
      </div>
    </div>
    <div
      ref="content"
      class="overflow-hidden text-md transition-all md:w-1/2"
      :style="dynamicHeight"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ title: string }>()

const open = ref(false)
const content = ref<HTMLDivElement>()

const dynamicHeight = computed(() =>
  open.value ? `height: ${content.value?.scrollHeight}px` : `height: 0px`,
)
</script>
