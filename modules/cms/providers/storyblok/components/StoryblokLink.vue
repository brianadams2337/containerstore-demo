<template>
  <SFLink v-if="!isInEditorMode" raw :to="resolvedLink" :target="target">
    <slot />
  </SFLink>
  <div v-else :to="to">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { defineOptions , computed } from 'vue'
import { type LinkList, routeList } from '~/utils/route'
import { isString as _isString } from 'radash'
import type { CMSStoryblokLink } from '../types'
import { useStoryblokHelpers } from '../composables/useStoryblokHelpers'

const props = withDefaults(defineProps<CMSStoryblokLink>(), { target: '_self' })

const { isInEditorMode } = useStoryblokHelpers()

const resolvedLink = computed(() => {
  if (!_isString(props.to)) {
    return props.to
  }
  const isPathRoute = props.to.includes('/')

  return isPathRoute ? props.to : routeList[props.to as keyof LinkList].path
})
defineOptions({ name: 'CMSStoryblokLink' })
</script>
