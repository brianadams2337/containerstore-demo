<template>
  <Portal to="backdrop">
    <FadeInTransition>
      <div
        class="fixed right-0 top-0 z-[51] flex w-full bg-black/50"
        :class="fullScreen ? 'h-full' : 'min-h-screen'">
        <div
          class="relative m-auto h-full w-full rounded-md bg-white p-8 md:w-[46.875rem]"
          :class="{ '!h-[95%] !w-[95%]': fullScreen }">
          <slot name="headline" />
          <button
            v-if="!hideCloseButton"
            data-test-id="close-button"
            class="absolute right-6 top-6 z-50 cursor-pointer p-3"
            @click="emit('close')">
            <IconCloseBold class="h-5 w-5" />
          </button>
          <slot />
        </div>
      </div>
    </FadeInTransition>
  </Portal>
</template>

<script setup lang="ts">
defineProps({
  hideCloseButton: {
    type: Boolean,
    default: false,
  },
  fullScreen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

function handleKeyUpEvent(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

const useKeyupEventListener = (shouldRemoveListener = false) => {
  const cleanup = useEventListener('keyup', handleKeyUpEvent)
  shouldRemoveListener && cleanup()
}

onMounted(() => useKeyupEventListener())

onUnmounted(() => useKeyupEventListener(true))
</script>

<script lang="ts">
export default {
  name: 'AppModal',
}
</script>
