<template>
  <div ref="listbox">
    <div ref="button" class="contents">
      <slot
        :is-open="isOpen"
        :close="close"
        :open="open"
        :toggle-listbox-open="toggleListboxOpen"
      />
    </div>
    <div ref="options" class="relative">
      <Transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <slot
          v-if="isOpen"
          name="options"
          :is-open="isOpen"
          :toggle-listbox-open="toggleListboxOpen"
          :close="close"
          :open="open"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import { useDropdownKeyboardBehavior } from '#storefront-ui'

const isOpen = ref(false)

const toggleListboxOpen = () => (isOpen.value = !isOpen.value)
const open = () => (isOpen.value = true)
const close = () => (isOpen.value = false)

const rootRef = useTemplateRef('listbox')
const buttonRef = useTemplateRef('button')
const optionsRef = useTemplateRef('options')

useDropdownKeyboardBehavior(
  { rootRef, buttonRef, optionsRef },
  { isOpen, close, open },
)
</script>
