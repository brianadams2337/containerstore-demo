<template>
  <div class="flex flex-col">
    <legend v-if="title" class="mb-2">{{ title }}</legend>
    <div class="flex items-center">
      <SFRadioItem
        v-for="item in items"
        :key="item.value"
        v-model="value"
        v-bind="item"
        class="mr-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="Item extends { label: string; value: any }">
import { SFRadioItem } from '#storefront-ui/components'

defineProps<{ items?: Item[]; title?: string }>()

const value = defineModel<string | number | undefined>()
</script>
