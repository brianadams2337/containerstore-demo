<template>
  <DefaultLink v-if="!isInEditorMode" raw v-bind="{ to, target }">
    <slot />
  </DefaultLink>
  <div v-else :to="to">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const { isInEditorMode } = useStoryblokHelpers()

defineProps({
  to: {
    type: [String, Object] as PropType<string | object>,
    required: true,
  },
  target: {
    type: String as PropType<'_self' | '_blank' | '_parent' | '_top'>,
    default: '',
  },
})
</script>
