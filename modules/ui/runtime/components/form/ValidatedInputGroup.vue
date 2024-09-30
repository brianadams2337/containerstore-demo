<template>
  <section class="relative h-20">
    <slot :is-valid="isValid" :error-messages="errorMessages" />
    <SFFadeInFromBottomTransition>
      <p
        v-if="!isValid"
        data-testid="validation-error-text"
        class="mt-1 text-start text-xs leading-[0.875rem] text-red-500"
      >
        {{ errorMessages[0] }}
      </p>
    </SFFadeInFromBottomTransition>
  </section>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import { computed } from 'vue'
import { SFFadeInFromBottomTransition } from '#storefront-ui/components'

type Errors = ErrorObject[] | string[]

const props = withDefaults(defineProps<{ errors: Errors }>(), {
  errors: () => [],
})

const isValid = computed(() => !props.errors.length)

const errorMessages = computed(() => {
  return props.errors.map((it) => (typeof it === 'string' ? it : it.$message))
})
</script>
