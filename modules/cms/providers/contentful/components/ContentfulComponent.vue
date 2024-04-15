<script setup lang="ts">
import type { Entry } from 'contentful'
import { ref, resolveDynamicComponent } from 'vue'
import { getComponentName } from '~/modules/cms/utils/helpers'
const props = defineProps<{
  blok: Entry
}>()

const blokRef = ref()
defineExpose({
  value: blokRef,
})

const componentFound: boolean =
  typeof resolveDynamicComponent(
    getComponentName(props.blok?.sys?.contentType?.sys?.id),
  ) !== 'string'
const componentName = ref(
  props.blok !== null
    ? getComponentName(props.blok?.sys?.contentType?.sys?.id)
    : null,
)

if (!componentFound) {
  console.error(
    `Component could not be found for blok "${componentName.value}"! Is it defined in main.ts as "app.component("${componentName.value}", ${componentName.value});"?`,
  )

  if (typeof resolveDynamicComponent(componentName.value) === 'string') {
    console.error(
      `Is the Fallback component "${componentName.value}" registered properly?`,
    )
  }
}
</script>

<template>
  <component
    :is="componentName"
    ref="blokRef"
    v-bind="{ ...$props, ...$attrs }"
  ></component>
</template>
