<template>
  <component
    v-bind="useWindowHistory ? {} : { to, ...(to && { raw: true }) }"
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
import type { RouteLocationRaw } from '#vue-router'
import { SFLink } from '#storefront-ui/components'

type Props = {
  to?: RouteLocationRaw
  useWindowHistory?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  to: '/',
  useWindowHistory: false,
})

const backClickEventHandling = computed(() => {
  return props.useWindowHistory ? { click: goBack } : {}
})

const componentName = computed(() => {
  return props.useWindowHistory ? 'button' : SFLink
})

const goBack = () => window?.history.back()
</script>
