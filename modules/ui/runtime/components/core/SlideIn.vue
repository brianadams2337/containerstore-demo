<template>
  <Transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    enter-active-class="transition ease-linear duration-200"
    leave-active-class="transition ease-linear duration-200 delay-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-show="isOpen" class="absolute inset-0 z-[100] overflow-hidden">
      <div class="fixed inset-0 inline-block bg-primary/50" @click="toggle" />

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
          class="fixed bottom-0 z-50 max-h-md w-full overflow-y-auto rounded-t-xl bg-white p-5 shadow-sm xl:right-0 xl:max-h-full xl:max-w-[22.5rem]"
          :class="slideClass"
        >
          <div class="relative flex h-full flex-col">
            <slot v-bind="toggle" name="slide-in-content">
              <div class="sticky -top-5 z-10 bg-white">
                <slot name="slide-in-header" :toggle="toggle" />
              </div>
              <slot name="slide-in-body" />
              <div class="sticky -bottom-5 z-10 bg-white p-5">
                <slot name="slide-in-actions" />
              </div>
            </slot>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useSlideIn } from '../../composables/useSlideIn'
import { watch } from 'vue'
import { SlideInType } from '#storefront-ui'

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
    enterClasses: 'translate-y-full xl:translate-y-0 xl:translate-x-full',
    enterToClasses: 'translate-y-0 xl:translate-x-0',
    leaveClasses: 'translate-y-0 xl:translate-x-0',
    leaveToClasses: 'translate-y-full xl:translate-y-0 xl:translate-x-full',
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
