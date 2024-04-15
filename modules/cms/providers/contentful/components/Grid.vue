<template>
  <section
    v-if="blok"
    class="grid auto-cols-fr py-0.5 md:grid-flow-col md:px-16"
    :class="[marginClasses[0], containerClasses]"
  >
    <component
      :is="getComponentName(column?.sys?.contentType?.sys?.id) ?? 'div'"
      v-for="column in blok?.fields.columns"
      :key="column?.sys.id"
      :blok="column"
      :sizes="sizes"
    />
  </section>
</template>

<script setup lang="ts">
import { getComponentName } from '~/modules/cms/utils/helpers'
import type { CMSGridProps } from '~/modules/cms/providers/contentful/types'
import { useContentfulMargins } from '~/modules/cms/providers/contentful/composables/useContentfulMargins'
const props = defineProps<CMSGridProps>()
const { marginClasses } = useContentfulMargins(props.blok?.fields.marginTop)

const containerClasses = computed(() => ({
  'md:container': props.blok?.fields.isContaineredDesktop,
  'max-md:container': props.blok?.fields.isContainered,
  'gap-0.5': props.blok?.fields.isSpaced,
}))
const sizes = computed(() => {
  const vw = Math.ceil(100 / (props?.blok?.fields.columns?.length || 1))
  return `xs:100vw sm:100vw md:100vw lg:${vw}vw  xl:${vw}vw  xxl:${vw}vw 2xl:${vw}vw `
})

defineOptions({ name: 'CMSGrid' })
</script>
