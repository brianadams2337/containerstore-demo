<template>
  <component
    :is="icon.component"
    v-if="icon.component"
    class="h-8"
    :class="{ 'w-10': icon.width === 10, 'w-20': icon.width === 20 }"
  />
  <span v-else class="capitalize">{{ paidWith }}</span>
</template>

<script setup lang="ts">
const props = defineProps({
  paidWith: { type: String, required: true },
})

const icon = computed(() => paidWithIcon(props.paidWith) ?? {})
</script>
