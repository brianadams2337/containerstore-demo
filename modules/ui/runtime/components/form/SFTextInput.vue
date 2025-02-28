<template>
  <div class="relative flex-1">
    <input
      v-bind="$attrs"
      :id="id"
      ref="input"
      v-model="modelValue"
      v-maska
      :data-maska="dataMaska"
      :required="required"
      :readonly="readonly"
      :name="name"
      :aria-required="required"
      :aria-invalid="hasErrors"
      :type="type"
      :placeholder="placeholder"
      class="peer h-12 w-full rounded-10 border border-gray-100 bg-gray-100 py-4 pl-4 pr-2 text-base font-variable text-gray-900 transition duration-100 input-white-autofill placeholder:text-transparent hover:border-gray-300 hover:bg-white focus:border-accent focus:bg-white focus:text-accent focus:shadow-none focus:outline focus:outline-3 focus:outline-offset-0 focus:outline-indigo-200/50"
      :class="{
        'border-gray-300 bg-white': modelValue,
        'focus:border-gray-300 focus:text-gray-900 focus:!outline-none':
          readonly,
        'border-2 border-status-error bg-white !text-status-error shadow-none !outline-0 hover:border-status-error focus:border-status-error':
          hasErrors,
      }"
    />
    <label
      :for="id"
      class="absolute left-2 top-4 w-full truncate pl-2.5 text-sm text-gray-600 duration-100 ease-linear placeholder-shown:bg-gray-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-focus:ml-1 peer-focus:w-fit peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-xs peer-focus:text-accent peer-focus:shadow-input-label after:peer-focus:text-accent"
      :style="{ maxWidth: `${inputWidth}px` }"
      :class="{
        [`after:ml-0.5 after:text-gray-600 after:content-['*']`]: required,
        '!text-gray-600 transition-none peer-focus:after:text-gray-600':
          readonly,
        'ml-1 !w-fit -translate-y-6 bg-white !px-1.5 text-xs !shadow-input-label':
          modelValue,
        '!text-status-error after:text-status-error peer-focus:after:text-status-error':
          hasErrors,
      }"
    >
      {{ placeholder }}
    </label>
    <p v-if="hint" class="mt-1 text-xs">{{ hint }}</p>
    <div
      v-if="$slots['append-icon']"
      class="absolute right-2 top-1/2 h-full w-10 -translate-y-1/2 py-1.5"
    >
      <slot name="append-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineOptions, computed, useTemplateRef } from 'vue'
import { vMaska } from 'maska/vue'
import { useElementSize } from '@vueuse/core'

defineOptions({ inheritAttrs: false })

const {
  type = 'text',
  mask = '',
  hint = '',
  required = false,
  hasErrors = false,
  placeholder,
  // Disabling unimport/auto-insert here due misdetection of "readonly" keyword
  // eslint-disable-next-line unimport/auto-insert
  readonly = false,
  name,
} = defineProps<{
  placeholder: string
  mask?: string | string[]
  required?: boolean
  type?: HTMLInputElement['type']
  readonly?: boolean
  hint?: string
  name?: string
  hasErrors?: boolean
}>()

const modelValue = defineModel<string>()

const input = useTemplateRef('input')
const { width: inputWidth } = useElementSize(input)

// TODO: Replace the placeholder and optional name with `useId` when upgrading to Nuxt 3.15.
// This will ensure that the generated ID is consistently persisted between the server and client.
// https://github.com/nuxt/nuxt/pull/30343
const id = computed(() => {
  return name
    ? `text-input-${placeholder}-${name}`
    : `text-input-${placeholder}`
})

const dataMaska = computed(() => {
  // Maska don't accept array for the dynamic mask approach.
  // String conversion is needed in order to make it work properly
  return Array.isArray(mask) ? JSON.stringify(mask) : mask
})
</script>
