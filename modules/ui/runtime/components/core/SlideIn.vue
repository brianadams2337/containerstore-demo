<template>
  <Transition
    :enter-from-class="
      [slideTypes[slideType].enterClasses, 'backdrop:opacity-0'].join(' ')
    "
    :enter-to-class="
      [slideTypes[slideType].enterToClasses, 'backdrop:opacity-100'].join(' ')
    "
    enter-active-class="transform transition-all duration-200 backdrop:transition backdrop:ease-linear backdrop:duration-200"
    leave-active-class="transform transition-all duration-200 backdrop:transition backdrop:ease-linear backdrop:duration-200"
    :leave-from-class="
      [slideTypes[slideType].leaveClasses, 'backdrop:opacity-100'].join(' ')
    "
    :leave-to-class="
      [slideTypes[slideType].leaveToClasses, 'backdrop:opacity-0'].join(' ')
    "
  >
    <!-- eslint-disable-next-line vue/require-toggle-inside-transition  -->
    <dialog
      v-dialog.modal="isOpen"
      class="h-full overflow-hidden transition-all backdrop:bg-black/50 max-sm:m-0 max-sm:h-screen max-sm:w-screen md:mr-0 md:rounded-xl"
      @click="onClick"
      @cancel="onCancel"
    >
      <div
        class="size-full overflow-y-auto bg-white md:inset-y-2 md:right-2 md:max-w-[25rem]"
        data-testid="slide-in-overflow"
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
