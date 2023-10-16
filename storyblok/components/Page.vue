<template>
  <div
    v-for="(content, index) in blok.content"
    :key="content._uid"
    v-editable="blok"
    :important="index < 2"
    :placeholder-ratio="isGreaterThan('md') ? '16/9' : '9/16'"
    placeholder-class="container">
    <component :is="content.component" :blok="content" />
  </div>
</template>

<script setup lang="ts">
import type { SbPage } from '~/storyblok/types/storyblok'

const { isGreaterThan } = useViewport()

defineProps({
  blok: {
    type: Object as PropType<SbPage>,
    required: true,
  },
})
</script>

<script lang="ts">
export default {
  name: 'CmsPage',
}
</script>
