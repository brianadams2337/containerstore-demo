<template>
  <div v-editable="blok" class="prose-sm fill-current">
    <div
      :class="{
        '[&>p:first-child]:!mt-0': noMarginTop,
      }"
      v-html="content"
    />
  </div>
</template>

<script lang="ts" setup>
import type { SbCmsText } from '../types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbCmsText>,
    required: true,
  },
  noMarginTop: {
    type: Boolean,
    default: false,
  },
})

const content = computed(() =>
  // @ts-ignore
  // TODO: Fix types / override `renderRichText` definition
  props.blok.body ? renderRichText(props.blok.body) : null,
)
</script>
