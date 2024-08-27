<template>
  <SFFadeInTransition>
    <dialog
      v-dialog.modal="visible"
      class="rounded backdrop:bg-black/50"
      :class="fullScreen ? 'h-full' : ''"
      @click="onClick"
      @cancel="onCancel"
    >
      <div
        class="relative m-auto size-full rounded-md bg-white p-8 md:w-[46.875rem]"
        :class="{ '!h-[95%] !w-[95%]': fullScreen }"
      >
        <slot name="headline" />
        <button
          v-if="!hideCloseButton"
          data-testid="close-button"
          class="absolute right-6 top-6 z-50 cursor-pointer p-3"
          @click="onCancel"
        >
          <IconClose class="size-5" />
        </button>
        <slot />
      </div>
    </dialog>
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { defineModel } from 'vue'
import { vDialog } from '../../directives/dialog'

type Props = {
  hideCloseButton?: boolean
  fullScreen?: boolean
  closeOnOutside?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideCloseButton: false,
  fullScreen: false,
  closeOnOutside: true,
})

const visible = defineModel<boolean>('visible', {
  type: Boolean,
  default: false,
})

const close = () => {
  visible.value = false
}

const onClick = (e: MouseEvent) => {
  if (!visible.value || !props.closeOnOutside) {
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
</script>
