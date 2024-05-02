<template>
  <div class="py-4">
    <button
      class="flex w-full justify-between text-xs font-semibold"
      @click="isCollapsed = !isCollapsed"
    >
      <span>{{ title }}</span>
      <IconPlus v-if="isCollapsed" class="size-4 text-primary" />
      <IconMinus v-else class="size-4 text-primary" />
    </button>
    <SFFadeInTransition>
      <div v-if="!isCollapsed" class="py-4 text-xs text-secondary">
        <slot />
      </div>
    </SFFadeInTransition>
  </div>
</template>

<script setup lang="ts" ii>
const props = withDefaults(
  defineProps<{ title: string; collapsed?: boolean }>(),
  { collapsed: false },
)
const isCollapsed = toRef(props.collapsed)
</script>
