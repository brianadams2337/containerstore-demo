<template>
  <div ref="dropdownContainer" class="relative inline-block text-left">
    <div ref="button">
      <AppButton
        type="ghost"
        class="inline-flex w-full min-w-[4.75rem] justify-between gap-0 rounded border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium shadow-sm"
        :disabled="disabled"
        :class="isLarge && 'py-[0.825rem]'"
        @click="isDropdownVisible = !isDropdownVisible"
      >
        <slot name="default">{{ modelValue }}</slot>
        <IconDropdown
          class="ml-0.5 mt-0.5 size-3 transition"
          :class="{ 'rotate-180': isDropdownVisible }"
        />
      </AppButton>
    </div>
    <Teleport to="body">
      <div
        v-if="isDropdownVisible"
        ref="dropdownOptions"
        class="absolute z-20 mt-2 w-full rounded-md bg-white shadow-lg ring-1 ring-gray-300 focus:outline-none"
        :style="itemsContainerStyle"
      >
        <template v-for="item in items">
          <slot name="item" v-bind="{ item, selectItem }">
            <div
              :key="`${item}`"
              class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300"
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
type Props = {
  items: T[]
  modelValue?: T
  isLarge?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  isLarge: false,
  disabled: false,
})
const isDropdownVisible = ref(false)

const emit = defineEmits(['update:model-value'])

const selectItem = (item: T) => {
  emit('update:model-value', item)
  isDropdownVisible.value = false
}

const dropdownOptions = ref(null)
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

defineOptions({ name: 'AppDropdown' })
</script>
