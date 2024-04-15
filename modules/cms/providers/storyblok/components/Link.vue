<template>
  <CMSStoryblokLink
    v-if="url"
    :to="url"
    :target="blok.open_in_new_tab ? '_blank' : '_self'"
  >
    {{ blok.label }}
  </CMSStoryblokLink>
</template>

<script lang="ts" setup>
import type { CMSLinkTypeProps } from '~/modules/cms/providers/storyblok/types'

const props = defineProps<CMSLinkTypeProps>()

const url = props.blok?.cta_url?.cached_url ?? null
defineOptions({ name: 'CMSLink' })
</script>
