<template>
  <RawLink
    v-if="url"
    :to="url"
    :target="blok.open_in_new_tab ? '_blank' : '_self'">
    {{ blok.label }}
  </RawLink>
</template>
<script lang="ts" setup>
import { LinkStoryblok } from '../types/component-types-sb'

const props = defineProps({
  blok: {
    type: Object as PropType<LinkStoryblok>,
    required: true,
  },
})

const url = props.blok?.cta_url?.cached_url ?? null
</script>
