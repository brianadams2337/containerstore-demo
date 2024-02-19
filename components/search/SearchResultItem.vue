<template>
  <li
    class="h-auto break-all rounded border p-2 transition-colors hover:border-primary hover:bg-secondary-450"
  >
    <DefaultLink
      class="flex w-full flex-1 items-center transition-colors duration-100 ease-in-out"
      :to="to"
      @click="emit('click:result')"
    >
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        height="48"
        width="38"
        provider="default"
        class="mr-3 rounded border"
      />
      <slot />
    </DefaultLink>
  </li>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

type Props = {
  term?: string
  imageUrl?: string
  to?: RouteLocationRaw
}

withDefaults(defineProps<Props>(), { term: '', imageUrl: '', to: '' })

const emit = defineEmits<{ 'click:result': [] }>()
</script>
