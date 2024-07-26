<template>
  <label
    :for="id"
    class="group flex cursor-pointer items-center space-x-2 text-sm font-medium"
  >
    <span class="flex size-4 items-center justify-center">
      <input
        :id="id"
        v-model="model"
        :value="item"
        class="peer absolute size-4 cursor-pointer appearance-none rounded border border-gray-400 checked:border-2 checked:border-accent hover:border-accent"
        type="checkbox"
      />
      <IconCheck
        class="z-10 size-3 text-accent opacity-0 peer-checked:opacity-100"
      />
    </span>

    <slot name="label">
      <span
        v-if="label"
        class="leading-none text-gray-400 group-checked:text-black"
      >
        {{ label }}
      </span>
    </slot>
  </label>
</template>

<script setup lang="ts" generic="T">
import { defineModel } from 'vue'

type Props = {
  item?: T
  id: string
  label?: string
}
withDefaults(defineProps<Props>(), {
  label: undefined,
})

const model = defineModel<T[] | boolean>()
</script>
