<template>
  <Portal to="backdrop">
    <FadeInTransition>
      <div
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true">
        <div class="flex min-h-screen items-center justify-center">
          <!-- TODO: maybe replace with backdrop component -->
          <div
            class="fixed inset-0 bg-black/50"
            aria-hidden="true"
            @click="emit('close')" />
          <div
            class="relative mx-5 w-full rounded-sm bg-white p-8 shadow-xl md:mx-0 md:w-[46.875rem]">
            <div class="flex">
              <slot name="headline" />

              <AppButton
                v-if="showCloseButton"
                class="right-8 top-8 ml-auto self-start"
                :no-padding="true"
                type="ghost"
                @click="emit('close')">
                <template #icon>
                  <IconClose class="h-5 w-5" />
                </template>
              </AppButton>
            </div>

            <slot name="default" />
          </div>
        </div>
      </div>
    </FadeInTransition>
  </Portal>
</template>

<script setup lang="ts">
defineProps({
  showCloseButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<script lang="ts">
export default {
  name: 'AppModal',
}
</script>
