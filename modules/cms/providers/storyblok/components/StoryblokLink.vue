<template>
  <SFLink v-if="!isInEditorMode" raw :to="resolvedLink" :target="target">
    <slot />
  </SFLink>
  <div v-else :to="to">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, defineOptions } from 'vue'
import type { CMSStoryblokLink } from '../types'
import { useStoryblokHelpers } from '../composables/useStoryblokHelpers'
import { type LinkList, routeList } from '~/utils/route'
import { SFLink } from '#storefront-ui/components'

const props = withDefaults(defineProps<CMSStoryblokLink>(), { target: '_self' })

const { isInEditorMode } = useStoryblokHelpers()

const resolvedLink = computed(() => {
  if (typeof props.to !== 'string') {
    return props.to
  }
  const isPathRoute = props.to.includes('/')

  return isPathRoute ? props.to : routeList[props.to as keyof LinkList].path
})
defineOptions({ name: 'CMSStoryblokLink' })
</script>
