<template>
  <div
    v-for="(content, index) in blok.content"
    :key="content._uid"
    v-editable="blok"
    :important="index < 2"
    :placeholder-ratio="isGreater('md') ? '16/9' : '9/16'"
    placeholder-class="container"
  >
    <component :is="content.component" :blok="content" />
  </div>
</template>

<script setup lang="ts">
import type { SbPage } from '../types/storyblok'

const { isGreater } = useDefaultBreakpoints()

defineProps({
  blok: {
    type: Object as PropType<SbPage>,
    required: true,
  },
})

defineOptions({ name: 'CmsPage' })
</script>
