<script setup lang="ts">
import type { StoryblokComponentType } from '@storyblok/vue'
import { ref, resolveDynamicComponent } from 'vue'
import { getComponentName } from '../../../utils/helpers'

export type SbBlokKeyDataTypes = string | number | object | boolean | undefined

const { blok } = defineProps<{ blok: StoryblokComponentType<string> }>()

const blokRef = ref()

defineExpose({
  value: blokRef,
})

const componentFound: boolean =
  typeof resolveDynamicComponent(getComponentName(blok.component)) !== 'string'

const componentName = ref(getComponentName(blok.component))
if (!componentFound) {
  console.error(
    `Component could not be found for blok "${getComponentName(
      blok.component,
    )}"! Is it defined in main.ts as "app.component("${getComponentName(
      blok.component,
    )}", ${getComponentName(blok.component)});"?`,
  )
}
</script>

<template>
  <component
    :is="componentName"
    ref="blokRef"
    v-bind="{ ...$props, ...$attrs }"
  />
</template>
