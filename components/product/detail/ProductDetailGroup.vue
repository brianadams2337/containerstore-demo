<template>
  <div>
    <Headline v-bind="{ tag, size }">
      <slot name="headline" />
    </Headline>
    <div class="mt-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeadlineSize, HeadlineTag } from '~/constants'

defineProps({
  tag: {
    type: String as PropType<HeadlineTag>,
    default: HeadlineTag.P,
  },
  size: {
    type: String as PropType<HeadlineSize>,
    default: HeadlineSize.SM,
  },
})
</script>
