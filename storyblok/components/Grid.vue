<template>
  <section
    v-editable="blok"
    class="grid auto-cols-fr py-0.5 md:grid-flow-col md:px-16"
    :class="[marginClasses[0], containerClasses]">
    <!-- Image is not allowed as a component so we have to rename it here -->
    <component
      :is="column.component"
      v-for="column in blok.columns"
      :key="column._uid"
      :blok="column"
      :sizes="sizes" />
  </section>
</template>

<script setup lang="ts">
import useStoryblokMargins from '../composables/useStoryblokMargins'
import { GridStoryblok } from '../types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<GridStoryblok>,
    required: true,
  },
})
const { marginClasses } = useStoryblokMargins(props.blok)

const containerClasses = computed(() => ({
  'md:container': props.blok.is_containered_desktop,
  'max-md:container': props.blok.is_containered,
  'gap-0.5': props.blok.is_spaced,
}))
const sizes = computed(() => {
  const vw = Math.ceil(100 / (props?.blok?.columns?.length || 1))

  return `xs:100vw sm:100vw md:100vw lg:${vw}vw  xl:${vw}vw  xxl:${vw}vw 2xl:${vw}vw `
})
</script>

<script lang="ts">
export default {
  name: 'CmsGrid',
}
</script>
