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
        class="relative m-auto w-full rounded-md bg-white"
        :class="{ '!h-[95%] !w-[95%]': fullScreen, 'p-8': !disablePadding, 'md:w-[46.875rem]': !fullScreen }"
      >
        <slot name="headline" />
        <button
          v-if="!hideCloseButton"
          data-testid="close-button"
          class="group absolute right-6 top-6 z-50 cursor-pointer rounded-full p-2.5 transition-colors max-md:bg-gray-100 md:hover:bg-gray-100"
          @click="onCancel"
        >
          <IconClose class="size-5 transition-colors md:fill-gray-400 md:group-hover:fill-black" />
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
  disablePadding?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideCloseButton: false,
  fullScreen: false,
  closeOnOutside: true,
  disablePadding: false,
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
