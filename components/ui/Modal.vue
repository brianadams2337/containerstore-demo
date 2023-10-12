<template>
  <Teleport to="body">
    <FadeInTransition>
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 z-[51] flex w-full bg-black/50"
        :class="fullScreen ? 'h-full' : 'min-h-screen'">
        <div
          ref="modalRef"
          class="relative m-auto h-full w-full rounded-md bg-white p-8 md:w-[46.875rem]"
          :class="{ '!h-[95%] !w-[95%]': fullScreen }">
          <slot name="headline" />
          <button
            v-if="!hideCloseButton"
            data-test-id="close-button"
            class="absolute right-6 top-6 z-50 cursor-pointer p-3"
            @click="close">
            <IconCloseBold class="h-5 w-5" />
          </button>
          <slot />
        </div>
      </div>
    </FadeInTransition>
  </Teleport>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  hideCloseButton: {
    type: Boolean,
    default: false,
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
  closeOnOutside: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const modalRef = ref()

const { isOpen, toggle } = useModal()

const close = () => {
  emit('close')
  toggle(false)
}

onClickOutside(modalRef, () => props.closeOnOutside && close())

const handleKeyUpEvent = (event: KeyboardEvent) => {
  event.key === 'Escape' && close()
}

const useKeyupEventListener = (shouldRemoveListener = false) => {
  const cleanup = useEventListener('keyup', handleKeyUpEvent)
  shouldRemoveListener && cleanup()
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

<script lang="ts">
export default {
  name: 'AppModal',
}
</script>
