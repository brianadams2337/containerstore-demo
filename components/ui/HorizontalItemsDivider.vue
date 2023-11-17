<template>
  <div class="inline-flex flex-wrap space-x-1">
    <slot :items="items">
      <component
        :is="tag"
        v-for="(item, idx) in items"
        :key="item.value"
        :to="{ name: 'product' }"
        :raw="tag === DividerItemTag.DEFAULT_LINK"
        class="text-sm font-light uppercase leading-none"
      >
        {{ item.label || item.value }}
        <template v-if="showDividerTag(idx, items.length)">/</template>
      </component>
    </slot>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="T extends { value: string; label?: string; to?: RouteLocationRaw }"
>
import type { RouteLocationRaw } from '#vue-router'
import { DividerItemTag } from '#imports'

defineProps({
  tag: {
    type: String as PropType<DividerItemTag>,
    default: DividerItemTag.PARAGRAPH,
  },
  items: {
    type: Array as PropType<T[]>,
    default: () => [],
  },
})
</script>
