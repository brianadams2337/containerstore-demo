<template>
  <RawLink v-if="!isInEditorMode" :to="to" :target="target"><slot /></RawLink>
  <div v-else :to="to"><slot /></div>
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
