<template>
  <DefaultLink
    v-if="pathParams && pathParams.path"
    :to="pathParams.path"
    :type="type"
    :open-in-new-tab="pathParams.openInNew"
    @mouseenter="emit('mouseenter:navigation-item')"
  >
    {{ displayName }}
  </DefaultLink>
</template>

<script setup lang="ts">
import type { NavigationTreeItem } from '@scayle/storefront-nuxt'
import { LinkVariant } from '#imports'

type Props = {
  navigationItem: NavigationTreeItem | null
  wrapper?: string
  type?: LinkVariant
}

const props = withDefaults(defineProps<Props>(), {
  navigationItem: null,
  wrapper: '',
  type: undefined,
})

const emit = defineEmits<{ 'mouseenter:navigation-item': [] }>()

const pathParams = computed(() => {
  if (!props.navigationItem) {
    return
  }
  if (props.navigationItem.type === 'category') {
    return { path: props.navigationItem.category?.path, openInNew: false }
  }
  if (props.navigationItem.type === 'page') {
    return { path: props.navigationItem.page, openInNew: true }
  }

  return {
    path: props.navigationItem.options?.url ?? '',
    openInNew: props.navigationItem.options?.isOpenInNewWindows ?? false,
  }
})
const displayName = computed(() => props.navigationItem?.name)
</script>
