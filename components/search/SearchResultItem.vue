<template>
  <li
    class="h-auto break-all rounded border p-2 transition-colors hover:border-primary hover:bg-secondary-450">
    <NuxtLink
      class="flex w-full flex-1 items-center transition-colors duration-100 ease-in-out"
      :to="to"
      @click="emit('click:result')">
      <NuxtImg
        v-if="imageUrl"
        class="mr-3 rounded border"
        height="48"
        width="38"
        provider="default"
        :src="imageUrl" />
      <slot />
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from '#vue-router'

defineProps({
  term: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  to: {
    type: [Object, String] as PropType<RouteLocationRaw>,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'click:result'): void
}>()
</script>
