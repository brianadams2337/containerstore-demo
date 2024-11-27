<template>
  <component
    :is="isLink ? SFLink : 'div'"
    v-bind="
      isLink
        ? {
            to: pathParams?.path,
            target: pathParams?.openInNew ? '_blank' : '_self',
            variant,
            raw: true,
          }
        : {}
    "
    :class="{
      'mr-3 block w-fit content-center rounded py-1 text-base font-normal leading-5 text-[var(--textColor)] transition-all hover:mr-0 hover:bg-[var(--backgroundColor)] hover:px-1.5':
        !raw && isLink,
      'mr-0 bg-[var(--backgroundColor)] px-1.5': isActive && !raw && isLink,
      'min-h-5 w-fit py-1 text-base font-semi-bold-variable leading-5 text-[var(--textColor)]':
        !raw && !isLink,
    }"
    :style="style"
    @mouseenter="emit('mouseenter:navigation-item')"
  >
    <div v-if="iconUrl" class="flex items-center gap-2">
      <object
        v-if="iconUrl"
        :data="iconUrl"
        type="image/svg+xml"
        :aria-labelledby="`${navigationItem.id}`"
        aria-hidden="true"
        class="pointer-events-none size-4"
        tabindex="-1"
      ></object>
      <span :id="`${navigationItem.id}`">
        <slot>
          {{ displayName }}
        </slot>
      </span>
    </div>
    <span v-else>
      <slot>
        {{ displayName }}
      </slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationTreeItem } from '@scayle/storefront-nuxt'
import Color from 'color'
import { useRuntimeConfig } from '#imports'
import type { LinkVariant } from '#storefront-ui'
import { useRouteHelpers } from '~/composables'
import { SFLink } from '#storefront-ui/components'
import { theme } from '#tailwind-config'

type Props = {
  navigationItem: NavigationTreeItem
  variant?: LinkVariant
  raw?: boolean
  isActive?: boolean
  disabledLink?: boolean
  textColor?: `#${string}`
  backgroundColor?: `#${string}`
}
const {
  navigationItem,
  raw = false,
  isActive = false,
  textColor,
  backgroundColor,
  disabledLink = undefined,
} = defineProps<Props>()

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
      openInNew: navigationItem.options?.isOpenInNewWindow ?? false,
    }
  }
  return null
})
const displayName = computed(() => navigationItem?.name)
const disabled = computed<boolean>(() =>
  disabledLink !== undefined
    ? disabledLink
    : !!navigationItem?.customData?.disabledLink,
)

const getStyle = (
  navigationTreeItem: NavigationTreeItem,
  fallbackBackgroundColor: `#${string}`,
  fallbackTextColor: `#${string}`,
) => {
  const linkColor = navigationTreeItem?.customData?.linkColor
  if (!linkColor) {
    return {
      '--backgroundColor': Color(fallbackBackgroundColor).hex(),
      '--textColor': Color(fallbackTextColor).hex(),
    }
  }
  return {
    '--backgroundColor': Color(linkColor).alpha(0.1).hexa(),
    '--textColor': Color(linkColor).hex(),
  }
}

const isLink = computed(() => {
  return pathParams.value?.path && !disabled.value
})
const style = computed(() => {
  return getStyle(
    navigationItem,
    backgroundColor ?? theme.colors.gray[100],
    textColor ??
      (isLink.value ? theme.colors.gray[600] : theme.colors.gray[900]),
  )
})
</script>
