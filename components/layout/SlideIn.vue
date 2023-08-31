<template>
  <transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    enter-active-class="transition ease-linear duration-200"
    leave-active-class="transition ease-linear duration-200 delay-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-show="isOpen" class="absolute inset-0 z-50 overflow-hidden">
      <div
        class="fixed inset-0 inline-block bg-gray-200 opacity-50"
        @click="toggle" />

      <transition
        :enter-from-class="slideTypes[slideType].enterClasses"
        :enter-to-class="slideTypes[slideType].enterToClasses"
        enter-active-class="transform transition-all duration-200 delay-75"
        leave-active-class="transform transition-all duration-200"
        :leave-from-class="slideTypes[slideType].leaveClasses"
        :leave-to-class="slideTypes[slideType].leaveToClasses">
        <div
          v-if="isOpen"
          class="max-h-md fixed bottom-0 z-50 w-full overflow-y-auto bg-white p-5 shadow-sm xl:right-0 xl:max-h-full xl:max-w-[22.5rem]"
          :class="slideClass">
          <div class="relative flex h-full flex-col">
            <slot v-bind="toggle" name="slideInContent">
              <div class="sticky -top-5 z-10 -m-5 bg-white p-5">
                <slot name="slideInHeader" :toggle="toggle" />
              </div>
              <slot name="slideInBody" />
              <div class="sticky -bottom-5 z-10 -m-5 bg-white p-5">
                <slot name="slideInActions" />
              </div>
            </slot>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
type SlideType = 'default' | 'fromBottom'

const props = defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },
  slideClass: {
    type: String,
    default: '',
  },
  slideType: {
    type: String as PropType<SlideType>,
    default: 'default',
    validator: (val: string) => ['default', 'fromBottom'].includes(val),
  },
})

const emit = defineEmits(['open', 'close'])

const { isOpen, toggle } = useSlideIn(props.name)

type SlideTypeClasses = {
  enterClasses: string
  enterToClasses: string
  leaveClasses: string
  leaveToClasses: string
}

const slideTypes: Record<SlideType, SlideTypeClasses> = {
  default: {
    enterClasses: 'translate-y-full xl:translate-y-0 xl:translate-x-full',
    enterToClasses: 'translate-y-0 xl:translate-x-0',
    leaveClasses: 'translate-y-0 xl:translate-x-0',
    leaveToClasses: 'translate-y-full xl:translate-y-0 xl:translate-x-full',
  },
  fromBottom: {
    enterClasses: 'translate-y-full',
    enterToClasses: 'translate-y-0',
    leaveClasses: 'translate-y-0',
    leaveToClasses: 'translate-y-full',
  },
}

watch(isOpen, (newValue) => {
  emit(newValue ? 'open' : 'close')
})
</script>
