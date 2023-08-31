<template>
  <component
    v-bind="useWindowHistory ? {} : { to }"
    :is="componentName"
    data-test-id="back-button"
    class="absolute z-30 flex items-center gap-2 text-primary"
    v-on="backClickEventHandling">
    <SvgoBack class="h-4 w-4" />
    <span class="text-xs font-semibold">{{ $t('global.back') }}</span>
  </component>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from '#vue-router'

const props = defineProps({
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: '/',
  },
  useWindowHistory: {
    type: Boolean,
    default: false,
  },
})

const backClickEventHandling = computed(() => {
  return props.useWindowHistory ? { click: goBack } : {}
})

const componentName = computed(() => {
  return props.useWindowHistory ? 'button' : 'NuxtLink'
})

const goBack = () => window?.history.back()
</script>
