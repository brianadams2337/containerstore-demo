<template>
  <div class="py-4">
    <button
      class="flex w-full justify-between text-xs font-semibold"
      @click="isCollapsed = !isCollapsed"
    >
      <span>{{ title }}</span>
      <IconPlus v-if="isCollapsed" class="h-4 w-4 text-primary" />
      <IconMinus v-else class="h-4 w-4 text-primary" />
    </button>
    <FadeInTransition>
      <div v-if="!isCollapsed" class="py-4 text-xs text-secondary">
        <slot />
      </div>
    </FadeInTransition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  collapsed: {
    type: Boolean,
    default: true,
  },
})

const isCollapsed = ref(props.collapsed)
</script>
