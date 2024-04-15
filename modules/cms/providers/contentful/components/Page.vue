<template>
  <div
    v-for="(content, index) in blok?.fields.content"
    :key="content?.sys.id"
    :important="index < 2"
    :placeholder-ratio="
      storefrontBreakpoints && storefrontBreakpoints.isGreater('md')
        ? '16/9'
        : '9/16'
    "
    placeholder-class="container"
  >
    <component
      :is="getComponentName(content?.sys.contentType.sys.id)"
      :blok="content"
    />
  </div>
</template>

<script setup lang="ts">
import { getComponentName } from '~/modules/cms/utils/helpers'
import type { CMSPageProps } from '~/modules/cms/providers/contentful/types'

const storefrontBreakpoints = useStorefrontBreakpoints()

defineProps<CMSPageProps>()

defineOptions({ name: 'CMSPage' })
</script>
