<script setup lang="ts">
import type { ISbComponentType } from 'storyblok-js-client'
import { ref, resolveDynamicComponent } from 'vue'
import { getComponentName } from '../../../utils/helpers'

export type SbBlokKeyDataTypes = string | number | object | boolean | undefined

export interface SbBlokData extends ISbComponentType<string> {
  [index: string]: SbBlokKeyDataTypes
}
export interface SbComponentProps {
  blok: SbBlokData
}
const props = defineProps<SbComponentProps>()

const blokRef = ref()

defineExpose({
  value: blokRef,
})

const componentFound: boolean =
  typeof resolveDynamicComponent(getComponentName(props.blok.component)) !==
  'string'

const componentName = ref(getComponentName(props.blok.component))
if (!componentFound) {
  console.error(
    `Component could not be found for blok "${getComponentName(
      props.blok.component,
    )}"! Is it defined in main.ts as "app.component("${getComponentName(
      props.blok.component,
    )}", ${getComponentName(props.blok.component)});"?`,
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
