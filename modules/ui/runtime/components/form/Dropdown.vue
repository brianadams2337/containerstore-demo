<template>
  <div ref="dropdownContainer" class="relative inline-block text-left">
    <div ref="button" class="h-full">
      <SFButton
        type="raw"
        size="sm"
        class="group inline-flex size-full justify-between gap-0 rounded-md border border-gray-300 bg-secondary-200 !px-3.5 !py-2 font-semi-bold-variable leading-5 hover:bg-white"
        :disabled="disabled"
        :class="isLarge && 'py-[0.825rem]'"
        @click="isDropdownVisible = !isDropdownVisible"
      >
        <slot name="default">
          <span class="max-w-[80%] text-ellipsis">{{ modelValue }}</span>
        </slot>
        <template #append-icon="{ _class }">
          <IconDropdown
            class="transition duration-300 group-hover:text-accent"
            :class="[{ 'rotate-180': isDropdownVisible }, _class]"
          />
        </template>
      </SFButton>
    </div>
    <Teleport to="body">
      <div
        ref="dropdownOptions"
        class="absolute z-110 mt-2 w-full rounded-md bg-white p-2 shadow-secondary ring-1 ring-gray-300 focus:outline-none"
        :class="
          isDropdownVisible
            ? 'animate-grow origin-top xl:origin-top-right'
            : 'animate-shrink origin-top xl:origin-top-right'
        "
        :style="itemsContainerStyle"
      >
        <template v-for="item in items">
          <slot name="item" :item="item" :select-item="selectItem">
            <div
              :key="`${item}`"
              class="block cursor-pointer px-4 py-2 text-base text-gray-700 hover:bg-gray-200 active:bg-gray-300"
              @keydown.enter="selectItem(item)"
              @click="selectItem(item)"
            >
              {{ item }}
            </div>
          </slot>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

type Props = {
  items: T[]
  modelValue?: T
  isLarge?: boolean
  disabled?: boolean
  isFullHeight?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  isLarge: false,
  disabled: false,
  isFullHeight: false,
})
const isDropdownVisible = ref(false)

const emit = defineEmits(['update:model-value'])

const selectItem = (item: T) => {
  emit('update:model-value', item)
  isDropdownVisible.value = false
}

const dropdownOptions = ref()
const dropdownContainer = ref()

onClickOutside(dropdownContainer, () => {
  isDropdownVisible.value = false
})

const button = ref()
const itemsContainerStyle = ref()

watch(isDropdownVisible, () => {
  if (!button.value) {
    return
  }

  const rect = button.value.getBoundingClientRect()

  itemsContainerStyle.value = {
    left: `${rect.left + window.scrollX}px`,
    top: `${rect.bottom + window.scrollY}px`,
    width: `${button.value!.offsetWidth}px`,
  }
})
</script>
