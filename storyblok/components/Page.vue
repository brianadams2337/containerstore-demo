<template>
  <div
    v-for="(content, index) in blok.content"
    :key="content._uid"
    v-editable="blok"
    :important="index < 2"
    :placeholder-ratio="md ? '16/9' : '9/16'"
    placeholder-class="container">
    <component :is="content.component" :blok="content" />
  </div>
</template>

<script setup lang="ts">
import { PageStoryblok } from '../types/component-types-sb'

// const { md } = useBreakpoints()
const md = ref(true)

defineProps({
  blok: {
    type: Object as PropType<PageStoryblok>,
    required: true,
  },
})
</script>

<script lang="ts">
export default {
  name: 'CmsPage',
}
</script>
