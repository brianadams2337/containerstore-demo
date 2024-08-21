<template>
  <SFFadeInTransition>
    <dialog
      ref="dialog"
      class="rounded backdrop:bg-black/50"
      :class="fullScreen ? 'h-full' : ''"
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
          @click="close"
        >
          <IconClose class="size-5" />
        </button>
        <slot />
      </div>
    </dialog>
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'

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

const dialog = ref<HTMLDialogElement | null>()

const showModal = () => {
  dialog.value?.showModal()
}

const close = () => {
  dialog.value?.close()
}

useEventListener(dialog, 'click', ({ target }) => {
  if (
    props.closeOnOutside &&
    target instanceof Element &&
    target.nodeName === 'DIALOG'
  ) {
    close()
  }
})

defineExpose({
  showModal,
  close,
})
</script>
