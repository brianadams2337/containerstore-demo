<template>
  <dialog
    ref="modal"
    v-dialog.modal="visible"
    class="max-h-dialog max-w-dialog rounded p-8 backdrop:bg-black/50"
    @click="onClick"
    @cancel="onCancel"
  >
    <button
      v-if="!hideCloseButton"
      data-testid="close-button"
      class="group absolute right-6 top-6 z-50 cursor-pointer rounded-full p-2.5 transition-colors max-md:bg-gray-100 md:hover:bg-gray-100"
      :aria-label="$t('global.cancel')"
      @click="onCancel"
    >
      <IconClose
        class="size-5 transition-colors md:fill-gray-400 md:group-hover:fill-black"
      />
    </button>
    <div class="m-auto w-full rounded-md bg-white">
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { watch, nextTick, useTemplateRef } from 'vue'
import { tabbable } from 'tabbable'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { vDialog } from '../../directives/dialog'

const { hideCloseButton = false, closeOnOutside = true } = defineProps<{
  hideCloseButton?: boolean
  closeOnOutside?: boolean
}>()

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
})
const emit = defineEmits<{ close: [] }>()

const close = () => {
  visible.value = false
  emit('close')
}

const onClick = (e: MouseEvent) => {
  if (!visible.value || !closeOnOutside) {
    return
  }

  // Close the dialog when the backdrop is clicked
  if (e.target instanceof Element && e.target?.nodeName === 'DIALOG') {
    close()
  }
}

// Intercept the cancel event that is triggered from other sources (e.g. escape keypress) then prevent
// the default behavior and use our own cancel behavior that uses an exit animation and keeps `isOpen` in sync
const onCancel = (e: Event) => {
  e.preventDefault()
  close()
}

const modal = useTemplateRef<HTMLDialogElement>('modal')

// Adding a focus trap will make sure you can still interact with the modal
// when there is an active focus trap in the content below the modal.
const { activate: activateModalTrap, deactivate: deactivateModalTrap } =
  useFocusTrap(modal, {
    initialFocus: () =>
      modal.value && tabbable(modal.value).length ? undefined : false,
    escapeDeactivates: false,
    immediate: visible.value,
  })

watch(visible, async (value) => {
  if (value) {
    await nextTick()
    activateModalTrap()
  } else {
    deactivateModalTrap()
  }
})
</script>
