<!-- TODO: DOMPurify -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="prose-sm fill-current">
    <div
      :class="{
        '[&>p:first-child]:!mt-0': noMarginTop,
      }"
      v-html="content ?? ''"
    />
  </div>
</template>

<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import type { CMSTextProps } from '~/modules/cms/providers/contentful/types'
const props = withDefaults(defineProps<CMSTextProps>(), {
  noMarginTop: false,
})

const content = computed(() =>
  props.blok ? documentToHtmlString(props.blok) : null,
)
defineOptions({ name: 'CMSText' })
</script>
