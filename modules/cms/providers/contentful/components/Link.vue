<template>
  <CMSContentfulLink
    v-if="blok && url"
    :to="url"
    :target="blok?.fields.openInNewTab ? '_blank' : '_self'"
  >
    {{ blok?.fields.label }}
  </CMSContentfulLink>
</template>

<script lang="ts" setup>
import { defineOptions } from 'vue'
import type { CMSLinkTypeProps } from '../types'

const props = defineProps<CMSLinkTypeProps>()

const url = props.blok?.fields.ctaUrl ?? null
defineOptions({ name: 'CMSLink' })
</script>
