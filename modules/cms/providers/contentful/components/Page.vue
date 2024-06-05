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
import { defineOptions } from 'vue'
import { useStorefrontBreakpoints } from '../composables/storefront/useStorefrontBreakpoints'
import { getComponentName } from '../../../utils/helpers'
import type { CMSPageProps } from '../types'

const storefrontBreakpoints = useStorefrontBreakpoints()

defineProps<CMSPageProps>()

defineOptions({ name: 'CMSPage' })
</script>
