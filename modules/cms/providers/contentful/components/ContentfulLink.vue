<template>
  <SFLink
    v-if="!isInEditorMode"
    raw
    :to="resolvedLink"
    :target="target ? target : '_self'"
  >
    <slot />
  </SFLink>
  <div v-else :to="to">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { defineOptions , computed } from 'vue'
import type { LinkList , routeList } from '~/utils/route'
import { isString as _isString } from 'radash'
import type { CMSContentfulLink } from '../types'
import { useContentfulHelpers } from '../composables/useContentfulHelpers'

const { isInEditorMode } = useContentfulHelpers()
const props = withDefaults(defineProps<CMSContentfulLink>(), { target: '' })

const resolvedLink = computed(() => {
  if (!_isString(props.to)) {
    return props.to
  }
  const isPathRoute = props.to.includes('/')

  return isPathRoute ? props.to : routeList[props.to as keyof LinkList].path
})
defineOptions({ name: 'CMSContentfulLink' })
</script>
