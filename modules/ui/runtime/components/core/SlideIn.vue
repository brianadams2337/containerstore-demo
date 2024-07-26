<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition ease-linear duration-200"
      leave-active-class="transition ease-linear duration-200 delay-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="isOpen" class="absolute inset-0 z-100 overflow-hidden">
        <div
          class="fixed inset-0 inline-block bg-primary/50"
          @click="toggle"
          @keydown.enter="toggle"
        />

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
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
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

const { isOpen, toggle } = useSlideIn(props.name)

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

watch(isOpen, (newValue) => (newValue ? emit('open') : emit('close')))
</script>
