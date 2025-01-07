<template>
  <component
    v-bind="
      hasHistory ? {} : { to: fallbackLink, ...(fallbackLink && { raw: true }) }
    "
    :is="componentName"
    data-testid="back-button"
    class="absolute z-20 flex items-center gap-2 text-primary"
    v-on="backClickEventHandling"
  >
    <IconBack class="size-4" />
    <span class="text-xs font-semibold">{{ $t('global.back') }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMounted } from '@vueuse/core'
import type { RouteLocationRaw } from '#vue-router'
import { SFLink } from '#storefront-ui/components'

const { fallbackLink = '/' } = defineProps<{
  fallbackLink?: RouteLocationRaw
}>()
const mounted = useMounted()
const hasHistory = computed(() => {
  return mounted.value && window.history.state.back
})

const backClickEventHandling = computed(() => {
  return hasHistory.value ? { click: goBack } : {}
})

const componentName = computed(() => (hasHistory.value ? 'button' : SFLink))

const goBack = () => window?.history.back()
</script>
