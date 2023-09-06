<template>
  <DefaultLink
    v-if="pathParams && pathParams.path"
    :to="pathParams.path"
    :open-in-new-tab="pathParams.openInNew"
    @mouseenter="$emit('mouseenter:navigationItem')"
    >{{ displayName }}</DefaultLink
  >
</template>

<script setup lang="ts">
import { NavigationTreeItem } from '@scayle/storefront-nuxt'
import { CLASSES_FOR_LINK_TYPES } from '~/constants'

const props = defineProps({
  navigationItem: {
    type: Object as PropType<NavigationTreeItem>,
    default: () => null,
  },
  wrapper: {
    type: String,
    default: '',
  },
  type: {
    type: String as PropType<keyof typeof CLASSES_FOR_LINK_TYPES>,
    default: undefined,
    validator: (val: string) => val in CLASSES_FOR_LINK_TYPES,
  },
})
defineEmits(['mouseenter:navigationItem'])

const pathParams = computed(() => {
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
const displayName = computed(() => {
  // @ts-ignore
  return props.navigationItem.name
})
</script>
