<template>
  <div
    class="flex justify-between gap-2 rounded-[10px] border border-gray-100 p-2"
  >
    <SFButton
      type="raw"
      :disabled="quantity <= 1 || disabled"
      class="group !size-9 shrink-0 rounded-md border-none bg-gray-100 disabled:bg-gray-100 md:!size-8"
      @click="quantity--"
    >
      <IconNewMinus class="size-6 fill-gray-500 group-disabled:fill-gray-300" />
    </SFButton>
    <input
      type="number"
      readonly
      :disabled="disabled"
      :value="quantity"
      class="mx-2 min-w-[2ch] max-w-[3ch] select-none text-center text-base font-semi-bold-variable tabular-nums outline-none focus:border-transparent focus:ring-0"
    />
    <SFButton
      type="raw"
      :disabled="quantity >= maxQuantity || disabled"
      class="group !size-9 shrink-0 rounded-md border-none bg-gray-100 disabled:bg-gray-100 md:!size-8"
      @click="quantity++"
    >
      <IconNewPlus class="size-6 fill-gray-500 group-disabled:fill-gray-300" />
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { defineModel } from 'vue'

const quantity = defineModel<number>({ required: true })

type Props = {
  maxQuantity?: number
  disabled?: boolean
}
withDefaults(defineProps<Props>(), {
  maxQuantity: Infinity,
  disabled: false,
})
</script>

<style lang="css" scoped>
input {
  appearance: textfield;
}
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  appearance: none;
}
</style>
