<template>
  <div ref="dropdownContainer" class="relative inline-block text-left">
    <div ref="button" class="h-full">
      <SFButton
        type="raw"
        size="sm"
        class="group inline-flex size-full justify-between gap-0 rounded-md border border-gray-300 bg-secondary-200 !px-3.5 !py-2 font-semi-bold-variable leading-5 hover:bg-white"
        :disabled="disabled"
        :class="{
          'py-[0.825rem]': isLarge,
          'rounded-md': radius == 'md',
          'rounded-[10px]': radius == 'lg',
          'rounded-xl': radius == 'xl',
        }"
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
    <SFOverlay v-if="isDropdownVisible && isMobile" />
    <Transition
      enter-from-class="translate-y-full md:-translate-y-10 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full md:-translate-y-10 opacity-0"
    >
      <div
        v-popover="isDropdownVisible"
        class="absolute m-0 mt-2 w-full rounded-md bg-white p-2 shadow-secondary ring-1 ring-gray-300 focus:outline-none"
        :class="[
          {
            'rounded-t-md md:rounded-md': radius == 'md',
            'rounded-t-[10px] md:rounded-[10px]': radius == 'lg',
            'rounded-t-xl md:rounded-xl': radius == 'xl',
          },
        ]"
        :style="itemsContainerStyle"
      >
        <div
          class="max-h-[330px] overflow-y-auto bg-white p-2 scrollbar-hide md:p-0"
          :class="{
            'rounded-md': radius == 'md',
            'rounded-[10px]': radius == 'lg',
            'rounded-xl': radius == 'xl',
          }"
        >
          <template v-for="item in items">
            <slot name="item" v-bind="{ item, selectItem }">
              <div
                :key="`${item}`"
                class="flex w-full cursor-pointer items-center justify-between space-x-2 p-2 transition-all hover:bg-gray-200"
                :class="{
                  'rounded-md': radius == 'md',
                  'rounded-[10px]': radius == 'lg',
                  'rounded-xl': radius == 'xl',
                }"
                @keydown.enter="selectItem(item)"
                @click="selectItem(item)"
              >
                {{ item }}
              </div>
            </slot>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts" generic="T">
import { defineModel, ref, watch } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { useDefaultBreakpoints } from '~/composables'
import { vPopover } from '../../directives/popover'

type Props = {
  items: NonNullable<T>[]
  isLarge?: boolean
  disabled?: boolean
  isFullHeight?: boolean
  radius?: 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<Props>(), {
  isLarge: false,
  disabled: false,
  isFullHeight: false,
  radius: 'md',
})

const isDropdownVisible = ref(false)

const modelValue = defineModel<T | undefined>('modelValue')

const selectItem = (item: T) => {
  modelValue.value = item
  isDropdownVisible.value = false
}

const dropdownOptions = ref()
const dropdownContainer = ref()

onClickOutside(dropdownContainer, () => {
  isDropdownVisible.value = false
})

const button = ref()
const itemsContainerStyle = ref()
const { smaller, active } = useDefaultBreakpoints()
const isMobile = smaller('md')

const calculateDropdown = () => {
  if (!button.value) {
    return
  }

  const rect = button.value.getBoundingClientRect()
  if (isMobile.value) {
    itemsContainerStyle.value = {
      left: `0`,
      bottom: `0`,
      width: `100%`,
      position: 'fixed',
    }
    return
  }

  itemsContainerStyle.value = {
    left: `${rect.left + window.scrollX}px`,
    top: `${rect.top + window.scrollY}px`,
    width: `${button.value!.offsetWidth}px`,
  }
}

watch(isDropdownVisible, calculateDropdown)

watch(() => active().value, calculateDropdown)

useEventListener('resize', calculateDropdown)
</script>
