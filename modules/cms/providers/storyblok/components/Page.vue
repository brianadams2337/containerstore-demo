<template>
  <div
    v-for="(content, index) in blok.content"
    :key="content._uid"
    v-editable="blok"
    :important="index < 2"
    :placeholder-ratio="
      storefrontBreakpoints && storefrontBreakpoints.isGreater('md')
        ? '16/9'
        : '9/16'
    "
    placeholder-class="container"
  >
    <component :is="getComponentName(content.component)" :blok="content" />
  </div>
</template>

<script setup lang="ts">
import type { CMSPageProps } from '~/modules/cms/providers/storyblok/types'
import { getComponentName } from '~/modules/cms/utils/helpers'

const storefrontBreakpoints = useStorefrontBreakpoints()

defineProps<CMSPageProps>()

defineOptions({ name: 'CMSPage' })
</script>
