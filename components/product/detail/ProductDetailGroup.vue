<template>
  <div>
    <SFHeadline v-bind="{ tag, size }" is-uppercase>
      <slot name="headline" />
    </SFHeadline>
    <div class="mt-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeadlineSize, HeadlineTag } from '#imports'

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
