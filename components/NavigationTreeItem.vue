<template>
  <DefaultLink
    v-if="pathParams && pathParams.path"
    :to="pathParams.path"
    :type="type"
    :open-in-new-tab="pathParams.openInNew"
    @mouseenter="$emit('mouseenter:navigation-item')">
    {{ displayName }}
  </DefaultLink>
</template>

<script setup lang="ts">
import type { NavigationTreeItem } from '@scayle/storefront-nuxt'
import { LinkVariant } from '#imports'

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
    type: String as PropType<LinkVariant>,
    default: undefined,
    validator: (val: LinkVariant) => Object.values(LinkVariant).includes(val),
  },
})
defineEmits(['mouseenter:navigation-item'])

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
