<template>
  <div class="inline-flex flex-wrap space-x-1">
    <slot :items="items">
      <component
        :is="tag"
        v-for="(item, idx) in items"
        :key="item.value"
        :to="{ name: 'product' }"
        class="text-sm font-light uppercase leading-none">
        {{ item.label || item.value }}
        <template v-if="showDividerTag(idx, items.length)">/</template>
      </component>
    </slot>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="T extends { value: string; label?: string; to?: RouteLocationRaw }">
import { RouteLocationRaw } from '#vue-router'

type DividerItemType = 'p' | 'RawLink' | 'NuxtLink'

defineProps({
  tag: {
    type: String as PropType<DividerItemType>,
    default: 'p',
  },
  items: {
    type: Array as PropType<T[]>,
    default: () => [],
  },
})
</script>
