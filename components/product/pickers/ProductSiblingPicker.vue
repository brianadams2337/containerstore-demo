<template>
  <div>
    <slot :items="items">
      <div v-if="withValues" class="mb-3 text-xs font-semibold text-secondary">
        {{ colorLabel }}
      </div>
      <div
        class="flex flex-wrap items-center"
        data-test-id="siblingColorsSelector"
        :class="spacing === 'narrow' ? 'space-x-2' : 'space-x-3'"
      >
        <slot name="items" :items="itemsToShow">
          <slot v-for="item in itemsToShow" name="item" :item="item">
            <span
              :key="`color-picker-color-${item.id}`"
              :style="`background-color:${item.id}`"
              class="inline-block size-4 rounded-full border border-black bg-white"
            />
          </slot>
        </slot>
        <slot name="further-items" :count="furtherItemsCount">
          <span
            v-show="isLimiting && furtherItemsCount > 0"
            class="cursor-pointer pl-1 font-medium leading-none text-gray-600"
            @click="toggleIsLimiting"
            @keydown.enter="toggleIsLimiting"
          >
            + {{ furtherItemsCount }}
          </span>
        </slot>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProductSibling } from '@scayle/storefront-nuxt'

type Props = {
  items?: ProductSibling[]
  withValues?: boolean
  spacing?: 'default' | 'narrow'
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  withValues: false,
  spacing: 'default',
  limit: 3,
})

const isLimiting = ref(true)

const itemsToShow = computed(() => {
  return isLimiting.value ? props.items.slice(0, props.limit) : props.items
})
const furtherItemsCount = computed(() => props.items.length - props.limit)

const colorLabel = computed(() => itemsToShow.value[0]?.colors[0]?.label || '')

const toggleIsLimiting = () => {
  isLimiting.value = !isLimiting.value
}
</script>
