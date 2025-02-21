<template>
  <div class="flex flex-col gap-2.5 rounded-lg border p-5">
    <SFHeadline size="base" tag="h2" class="font-semi-bold-variable">
      {{ title }}
    </SFHeadline>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { SFHeadline } from '#storefront-ui/components'

defineProps<{ title: string }>()
</script>
