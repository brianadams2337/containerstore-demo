<template>
  <DefaultLink v-if="!isInEditorMode" raw :to="resolvedLink" :target="target">
    <slot />
  </DefaultLink>
  <div v-else :to="to">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { CMSStoryblokLink } from '~/modules/cms/providers/storyblok/types'
import { useStoryblokHelpers } from '~/modules/cms/providers/storyblok/composables/useStoryblokHelpers'

const props = withDefaults(defineProps<CMSStoryblokLink>(), { target: '_self' })

const { isInEditorMode } = useStoryblokHelpers()

const resolvedLink = computed(() => {
  if (!isString(props.to)) {
    return props.to
  }
  const isPathRoute = props.to.includes('/')

  return isPathRoute ? props.to : routeList[props.to as keyof LinkList].path
})
defineOptions({ name: 'CMSStoryblokLink' })
</script>
