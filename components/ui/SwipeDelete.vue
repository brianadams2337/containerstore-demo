<template>
  <div
    ref="container"
    class="relative m-auto flex w-full items-center justify-center"
  >
    <div
      ref="content"
      class="z-10 flex size-full items-center justify-center bg-white"
      :class="{ 'transition-all duration-200 ease-linear': !isSwiping }"
      :style="{ transform: `translateX(${contentOffset})`, opacity }"
    >
      <slot></slot>
    </div>
    <div
      v-show="isSwiping"
      class="absolute right-0 flex h-full items-center justify-center bg-red-500"
      :style="{ width: actionWidth, opacity }"
    >
      <IconTrash class="size-5" />
    </div>
  </div>
</template>

<script setup lang="ts">
const container = ref<HTMLElement | null>(null)
const emit = defineEmits(['delete'])

const containerWidth = computed(() => container.value?.offsetWidth)
const contentOffset = ref('0')
const actionWidth = ref('0')
const opacity = ref(1)

const content = ref<HTMLElement | null>(null)

const reset = () => {
  contentOffset.value = '0'
  actionWidth.value = `0`
  opacity.value = 1
}

const { lengthX, isSwiping, direction } = useSwipe(content, {
  onSwipe() {
    if (containerWidth.value && direction.value === 'left') {
      // Move container
      const distance = lengthX.value
      contentOffset.value = `${-distance}px`
      actionWidth.value = `${distance}px`
    }
  },
  onSwipeEnd() {
    if (
      direction.value === 'left' &&
      containerWidth.value &&
      Math.abs(lengthX.value) / containerWidth.value >= 0.5
    ) {
      contentOffset.value = `${-containerWidth.value}px`
      actionWidth.value = `${containerWidth.value}`
      opacity.value = 0
      emit('delete')
    } else {
      reset()
    }
  },
})
</script>
