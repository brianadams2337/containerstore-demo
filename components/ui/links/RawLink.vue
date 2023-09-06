<template>
  <nuxt-link v-if="isInternalLink" v-bind="props" :to="internalLink">
    <slot />
  </nuxt-link>
  <a v-else :href="externalLink" :target="target ?? '_blank'"><slot /></a>
</template>

<script setup lang="ts">
const props = defineProps({
  to: {
    type: [String, Object] as PropType<any>,
    required: true,
  },
  target: {
    type: String as PropType<'_self' | '_blank' | '_parent' | '_top'>,
    default: undefined,
  },
  exact: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  exactPath: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  append: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  replace: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  activeClass: {
    type: String,
    default: undefined,
  },
  exactActiveClass: {
    type: String,
    default: undefined,
  },
  openInNewTab: { type: Boolean as PropType<boolean>, default: false },
})

const isInternalLink = computed(
  () => typeof props.to === 'object' || !props.to?.startsWith('http'),
)
const internalLink = computed(() => ensureStartingWithSlash(props.to as string))

function ensureStartingWithSlash(path: string) {
  return typeof path === 'string' && path[0] !== '/' ? `/${path}` : path
}

const externalLink = computed(() => {
  return typeof props.to === 'string' ? props.to : undefined
})
</script>
