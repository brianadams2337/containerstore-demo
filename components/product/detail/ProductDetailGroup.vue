<template>
  <div>
    <SFHeadline :tag="tag" :size="size" is-uppercase>
      <slot name="headline" />
    </SFHeadline>
    <div class="mt-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeadlineSize, HeadlineTag } from '#storefront-ui'

type Props = {
  tag?: HeadlineTag
  size?: HeadlineSize
}

withDefaults(defineProps<Props>(), {
  tag: HeadlineTag.P,
  size: HeadlineSize.SM,
})
</script>
