<template>
  <DefaultLink v-if="!isInEditorMode" raw :to="resolvedLink" :target="target">
    <slot />
  </DefaultLink>
  <div v-else :to="to">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { RouteLocationRaw } from '#vue-router'

type Props = {
  to: RouteLocationRaw
  target?: '_self' | '_blank' | '_parent' | '_top'
}

const props = withDefaults(defineProps<Props>(), { target: '_self' })

const { isInEditorMode } = useStoryblokHelpers()

const resolvedLink = computed(() => {
  if (!isString(props.to)) {
    return props.to
  }
  const isPathRoute = props.to.includes('/')

  return isPathRoute ? props.to : routeList[props.to as keyof LinkList].path
})
</script>
