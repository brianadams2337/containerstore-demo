<template>
  <StoryblokLink
    v-if="url"
    :to="url"
    :target="blok.open_in_new_tab ? '_blank' : '_self'">
    {{ blok.label }}
  </StoryblokLink>
</template>

<script lang="ts" setup>
import { SbLink } from '~/storyblok/types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbLink>,
    required: true,
  },
})

const url = props.blok?.cta_url?.cached_url ?? null
</script>
