<template>
  <section
    v-editable="blok"
    class="grid auto-cols-fr py-0.5 md:grid-flow-col md:px-16"
    :class="[marginClasses[0], containerClasses]"
  >
    <!-- Image is not allowed as a component so we have to rename it here -->
    <component
      :is="getComponentName(column.component) ?? 'div'"
      v-for="column in blok.columns"
      :key="column._uid"
      :blok="column"
      :sizes="sizes"
    />
  </section>
</template>

<script setup lang="ts">
import { defineOptions , computed } from 'vue'
import type { CMSGridProps } from '../types'
import { getComponentName } from '../../../utils/helpers'
import { useStoryblokMargins } from '../composables/useStoryblokMargins'
const props = defineProps<CMSGridProps>()
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

defineOptions({ name: 'CMSGrid' })
</script>
