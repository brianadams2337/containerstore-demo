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
import { computed, defineOptions } from 'vue'
import { isString } from 'radash'
import type { CMSContentfulLink } from '../types'
import { useContentfulHelpers } from '../composables/useContentfulHelpers'
import { type LinkList, routeList } from '~/utils/route'

const { isInEditorMode } = useContentfulHelpers()
const props = withDefaults(defineProps<CMSContentfulLink>(), { target: '' })

const resolvedLink = computed(() => {
  if (!isString(props.to)) {
    return props.to
  }
  const isPathRoute = props.to.includes('/')

  return isPathRoute ? props.to : routeList[props.to as keyof LinkList].path
})
defineOptions({ name: 'CMSContentfulLink' })
</script>
