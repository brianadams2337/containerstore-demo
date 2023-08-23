<template>
  <section class="relative h-20">
    <slot v-bind="{ isValid, errorMessages }" />
    <FadeInFromBottomTransition>
      <p
        v-if="!isValid"
        data-test-id="validation-error-text"
        class="mt-1 text-start text-xs leading-[0.875rem] text-red-500">
        {{ errorMessages[0] }}
      </p>
    </FadeInFromBottomTransition>
  </section>
</template>

<script setup lang="ts">
import { ErrorObject } from '@vuelidate/core'

const props = defineProps({
  errors: {
    type: Array as PropType<ErrorObject[] | string[]>,
    default: () => [],
  },
})

const isValid = computed(() => !props.errors.length)

const errorMessages = computed(() => {
  return props.errors.map((it) => (typeof it === 'string' ? it : it.$message))
})
</script>
