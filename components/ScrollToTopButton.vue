<template>
  <SFFadeInTransition :duration="150">
    <SFButton
      v-if="!arrivedState.top"
      type="secondary"
      v-bind="$attrs"
      class="z-100 size-12 rounded-xl !p-0 !text-gray-400 transition-transform duration-150 ease-in-out md:size-9"
      @click="scrollToTop"
    >
      <template #icon>
        <IconChevronUp class="size-5 md:size-3" />
      </template>
    </SFButton>
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { SFFadeInTransition, SFButton } from '#storefront-ui/components'

const { arrivedState } = useScroll(window)

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>
