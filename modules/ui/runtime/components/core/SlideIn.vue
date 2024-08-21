<template>
  <Transition
    enter-from-class="opacity-0 backdrop:opacity-0"
    enter-to-class="opacity-100 backdrop:opacity-100"
    enter-active-class="transition ease-linear duration-200 backdrop:transition backdrop:ease-linear backdrop:duration-200"
    leave-active-class="transition ease-linear duration-200 delay-100 backdrop:transition backdrop:ease-linear backdrop:duration-200 backdrop:delay-100"
    leave-from-class="opacity-100 backdrop:opacity-100"
    leave-to-class="opacity-0 backdrop:opacity-0"
  >
    <!-- eslint-disable-next-line vue/require-toggle-inside-transition  -->
    <dialog
      v-dialog.modal="isOpen"
      class="absolute inset-0 overflow-hidden backdrop:bg-black/50"
      @click="onClick"
      @cancel="onCancel"
    >
      <Transition
        :enter-from-class="slideTypes[slideType].enterClasses"
        :enter-to-class="slideTypes[slideType].enterToClasses"
        enter-active-class="transform transition-all duration-200 delay-75"
        leave-active-class="transform transition-all duration-200"
        :leave-from-class="slideTypes[slideType].leaveClasses"
        :leave-to-class="slideTypes[slideType].leaveToClasses"
      >
        <div
          v-if="isOpen"
          class="fixed z-50 size-full overflow-y-auto bg-white md:inset-y-2 md:right-2 md:size-auto md:max-w-[25rem] md:rounded-xl"
          :class="slideClass"
        >
          <div class="relative flex h-full flex-col">
            <slot v-bind="toggle" name="slide-in-content">
              <div
                class="sticky top-0 z-10 border-b border-b-gray-200 bg-white/90 px-6 py-4"
              >
                <slot name="slide-in-header" :toggle="toggle" />
              </div>
              <slot name="slide-in-body" />
              <div
                class="sticky bottom-0 z-10 mt-auto border-t border-t-gray-200 bg-white p-6"
              >
                <slot name="slide-in-actions" />
              </div>
            </slot>
          </div>
        </div>
      </Transition>
    </dialog>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { vDialog } from '../../directives/dialog'
import { useSlideIn, SlideInType } from '#storefront-ui'

type Props = {
  name: string
  slideClass?: string
  slideType?: SlideInType
}

const props = withDefaults(defineProps<Props>(), {
  slideClass: '',
  slideType: SlideInType.DEFAULT,
})

const emit = defineEmits<{ open: []; close: [] }>()

const { isOpen, toggle, close } = useSlideIn(props.name)

type SlideTypeClasses = Record<
  'enterClasses' | 'enterToClasses' | 'leaveClasses' | 'leaveToClasses',
  string
>

const slideTypes: Record<SlideInType, SlideTypeClasses> = {
  [SlideInType.DEFAULT]: {
    enterClasses: 'translate-y-full md:translate-y-0 md:translate-x-full',
    enterToClasses: 'translate-y-0 md:translate-x-0',
    leaveClasses: 'translate-y-0 md:translate-x-0',
    leaveToClasses: 'translate-y-full md:translate-y-0 md:translate-x-full',
  },
  [SlideInType.FROM_BOTTOM]: {
    enterClasses: 'translate-y-full',
    enterToClasses: 'translate-y-0',
    leaveClasses: 'translate-y-0',
    leaveToClasses: 'translate-y-full',
  },
}

const onClick = (e: MouseEvent) => {
  if (!isOpen.value) {
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

watch(isOpen, (newValue) => (newValue ? emit('open') : emit('close')))
</script>
