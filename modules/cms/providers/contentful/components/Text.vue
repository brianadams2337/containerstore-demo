<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="prose-sm fill-current">
    <div
      :class="{ '[&>p:first-child]:!mt-0': noMarginTop }"
      v-html="content ?? ''"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineOptions } from 'vue'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import type { CMSTextProps } from '../types'

const { blok, noMarginTop = false } = defineProps<CMSTextProps>()

const content = computed(() => (blok ? documentToHtmlString(blok) : null))

defineOptions({ name: 'CMSText' })
</script>
