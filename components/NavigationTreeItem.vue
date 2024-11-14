<template>
  <SFLink
    v-if="pathParams && pathParams.path && !disabledLink"
    :to="pathParams.path"
    :type="type"
    :target="pathParams.openInNew ? '_blank' : '_self'"
    class="block w-fit"
    @mouseenter="emit('mouseenter:navigation-item')"
  >
    <div v-if="iconUrl" class="flex items-center gap-2 rounded-md">
      <object
        v-if="iconUrl"
        :data="iconUrl"
        type="image/svg+xml"
        :aria-labelledby="id"
        aria-hidden="true"
        class="pointer-events-none size-4"
        tabindex="-1"
      ></object>
      <span :id="id">{{ displayName }}</span>
    </div>
    <span v-else>
      {{ displayName }}
    </span>
  </SFLink>
  <span v-else>{{ displayName }}</span>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import type { NavigationTreeItem } from '@scayle/storefront-nuxt'
import { useRuntimeConfig } from '#imports'
import type { LinkVariant } from '#storefront-ui'
import { useRouteHelpers } from '~/composables'
import { SFLink } from '#storefront-ui/components'

type Props = {
  navigationItem: NavigationTreeItem | null
  type?: LinkVariant
  disabledLink?: boolean
}

const {
  navigationItem = null,
  type,
  disabledLink = false,
} = defineProps<Props>()

const id = useId()

const { buildCategoryPath, getLocalizedRoute } = useRouteHelpers()

const {
  public: { cdnUrl },
} = useRuntimeConfig()

const iconUrl = computed(() => {
  const assets = Object.values(navigationItem?.assets ?? {})
  const icon = assets.find((asset) => asset.endsWith('svg'))
  if (!cdnUrl || !icon) {
    return
  }
  return cdnUrl + icon
})

const emit = defineEmits<{ 'mouseenter:navigation-item': [] }>()

const pathParams = computed(() => {
  if (!navigationItem) {
    return
  }
  if (navigationItem.type === 'category' && navigationItem.category) {
    return {
      path: buildCategoryPath(navigationItem.category),
      openInNew: false,
    }
  }
  if (navigationItem.type === 'page') {
    return {
      path: getLocalizedRoute(navigationItem.page),
      openInNew: true,
    }
  }

  if (
    navigationItem.type === 'external' ||
    navigationItem.type === 'individual-link'
  ) {
    return {
      path: getLocalizedRoute(navigationItem.options?.url ?? ''),
      openInNew: navigationItem.options?.isOpenInNewWindows ?? false,
    }
  }
  return null
})
const displayName = computed(() => navigationItem?.name)
</script>
