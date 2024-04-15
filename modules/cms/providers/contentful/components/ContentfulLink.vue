<template>
  <DefaultLink
    v-if="!isInEditorMode"
    raw
    :to="resolvedLink"
    :target="target ? target : '_self'"
  >
    <slot />
  </DefaultLink>
  <div v-else :to="to">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { CMSContentfulLink } from '~/modules/cms/providers/contentful/types'
import { useContentfulHelpers } from '~/modules/cms/providers/contentful/composables/useContentfulHelpers'
const { isInEditorMode } = useContentfulHelpers()
const props = withDefaults(defineProps<CMSContentfulLink>(), {
  target: '',
})

const resolvedLink = computed(() => {
  if (!isString(props.to)) {
    return props.to
  }
  const isPathRoute = props.to.includes('/')

  return isPathRoute ? props.to : routeList[props.to as keyof LinkList].path
})
defineOptions({ name: 'CMSContentfulLink' })
</script>
