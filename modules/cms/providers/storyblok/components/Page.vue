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
import { defineOptions } from 'vue'
import { useStorefrontBreakpoints } from '../composables/storefront/useStorefrontBreakpoints'
import type { CMSPageProps } from '../types'
import { getComponentName } from '../../../utils/helpers'

const storefrontBreakpoints = useStorefrontBreakpoints()

defineProps<CMSPageProps>()

defineOptions({ name: 'CMSPage' })
</script>
