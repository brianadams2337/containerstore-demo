<template>
  <label
    class="group relative flex cursor-pointer items-center text-sm font-medium"
  >
    <input
      v-model="selected"
      :value="value"
      :name="name"
      :disabled="disabled"
      type="radio"
      class="peer absolute left-0 top-0 z-0 opacity-0"
      :data-testid="`radio-button-${value}`"
    />
    <div
      class="z-10 inline-flex size-5 items-center justify-center rounded-full border-2 bg-white"
      :class="isActive ? 'border-primary' : 'border-secondary-700'"
    >
      <span
        v-show="isActive"
        class="inline-block size-2 rounded-full bg-black"
      />
    </div>
    <span
      v-if="label"
      class="ml-2 peer-disabled:text-secondary-700 peer-disabled:line-through"
    >
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts" generic="Item extends { label: string; value: any }">
import { computed } from 'vue'

type Props = {
  value?: Item['value']
  label?: Item['label']
  name?: string
  disabled?: boolean
}
const { value, label, name = '', disabled = false } = defineProps<Props>()

const selected = defineModel<string | number | undefined>()

const isActive = computed<boolean>(() => selected.value === value)
</script>
