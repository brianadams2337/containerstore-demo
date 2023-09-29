<template>
  <div
    v-if="isModalOpen"
    class="fixed right-0 top-0 z-[51] flex h-full w-full bg-black/50">
    <div
      class="relative m-auto h-full w-full rounded-md bg-white sm:h-[95%] sm:w-[95%]">
      <button
        data-test-id="close-button"
        class="absolute right-6 top-6 z-50 cursor-pointer p-3"
        @click="emit('click:close-modal')">
        <IconCloseBold class="h-5 w-5" />
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'click:close-modal'): void
  (e: 'esc:close-modal'): void
}>()

const { isModalOpen, setModalOpenState } = useUiState()

function handleKeyUpEvent(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('esc:close-modal')
  }
}

const useKeyupEventListener = (shouldRemoveListener = false) => {
  const cleanup = useEventListener('keyup', handleKeyUpEvent)
  shouldRemoveListener && cleanup()
}

onMounted(() => {
  setModalOpenState(true)
  useKeyupEventListener()
})

onUnmounted(() => {
  setModalOpenState(false)
  useKeyupEventListener(true)
})
</script>
