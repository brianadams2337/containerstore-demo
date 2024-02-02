<template>
  <DefaultLink v-if="!isInEditorMode" raw :to="resolvedLink" :target="target">
    <slot />
  </DefaultLink>
  <div v-else :to="to">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const { isInEditorMode } = useStoryblokHelpers()

const props = defineProps({
  to: {
    type: [String, Object] as PropType<string | object>,
    required: true,
  },
  target: {
    type: String as PropType<'_self' | '_blank' | '_parent' | '_top'>,
    default: '',
  },
})

const resolvedLink = computed(() => {
  if (!isString(props.to)) {
    return props.to
  }
  const isPathRoute = props.to.includes('/')

  return isPathRoute ? props.to : routeList[props.to as keyof LinkList].path
})
</script>
