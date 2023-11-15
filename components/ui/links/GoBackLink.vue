<template>
  <component
    v-bind="useWindowHistory ? {} : { to }"
    :is="componentName"
    :raw="componentName === Component.DEFAULT_LINK"
    data-test-id="back-button"
    class="text-primary absolute z-30 flex items-center gap-2"
    v-on="backClickEventHandling">
    <IconBack class="h-4 w-4" />
    <span class="text-xs font-semibold">{{ $t('global.back') }}</span>
  </component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

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

const Component = {
  BUTTON: 'Button',
  DEFAULT_LINK: 'DefaultLink',
}

const backClickEventHandling = computed(() => {
  return props.useWindowHistory ? { click: goBack } : {}
})

const componentName = computed(() => {
  return props.useWindowHistory
    ? Component.BUTTON
    : resolveComponent(Component.DEFAULT_LINK)
})

const goBack = () => window?.history.back()
</script>
