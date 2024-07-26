<template>
  <SFLink
    v-if="pathParams && pathParams.path"
    :to="pathParams.path"
    :type="type"
    :open-in-new-tab="pathParams.openInNew"
    @mouseenter="emit('mouseenter:navigation-item')"
  >
    {{ displayName }}
  </SFLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationTreeItem } from '@scayle/storefront-nuxt'
import type { LinkVariant } from '#storefront-ui'
import { useRouteHelpers } from '~/composables'

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

const { buildCategoryPath } = useRouteHelpers()

const emit = defineEmits<{ 'mouseenter:navigation-item': [] }>()

const pathParams = computed(() => {
  if (!props.navigationItem) {
    return
  }
  if (
    props.navigationItem.type === 'category' &&
    props.navigationItem.category
  ) {
    return {
      path: buildCategoryPath(props.navigationItem.category),
      openInNew: false,
    }
  }
  if (props.navigationItem.type === 'page') {
    return { path: props.navigationItem.page, openInNew: true }
  }

  if (props.navigationItem.type === 'external') {
    return {
      path: props.navigationItem.options?.url ?? '',
      openInNew: props.navigationItem.options?.isOpenInNewWindows ?? false,
    }
  }
  return null
})
const displayName = computed(() => props.navigationItem?.name)
</script>
