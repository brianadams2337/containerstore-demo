<template>
  <Teleport to="body">
    <SFFadeInTransition>
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 z-100 flex w-full bg-black/50"
        :class="fullScreen ? 'h-full' : 'min-h-screen'"
      >
        <div
          ref="modalRef"
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
      </div>
    </SFFadeInTransition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { useModal } from '#storefront-ui'

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

const emit = defineEmits<{ close: [] }>()

const modalRef = ref()

const { isOpen, toggle } = useModal()

const close = () => {
  emit('close')
  toggle(false)
}

onClickOutside(modalRef, () => props.closeOnOutside && close())

const handleKeyUpEvent = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') {
    return
  }

  close()
}

const useKeyupEventListener = (shouldRemoveListener = false) => {
  const cleanup = useEventListener('keyup', handleKeyUpEvent)

  if (shouldRemoveListener) {
    cleanup()
  }
}

onMounted(() => {
  toggle(true)
  useKeyupEventListener()
})

onUnmounted(() => {
  toggle(false)
  useKeyupEventListener(true)
})
</script>
