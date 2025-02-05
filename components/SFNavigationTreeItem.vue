<template>
  <component
    :is="isLink ? SFLink : 'div'"
    v-bind="
      isLink
        ? {
            to: pathParams?.route,
            target: pathParams?.openInNew ? '_blank' : '_self',
            variant,
            raw: true,
          }
        : {}
    "
    :class="{
      'mr-3 block w-fit content-center rounded p-1 text-base font-normal leading-5 text-[var(--textColor)] transition-all supports-hover:hover:bg-[var(--backgroundColor)]':
        !raw && isLink,
      'mr-0 bg-[var(--backgroundColor)]': isActive && !raw && isLink,
      'min-h-5 w-fit p-1 text-base font-semi-bold-variable leading-5 text-[var(--textColor)]':
        !raw && !isLink,
    }"
    :style="style"
    @mouseenter="emit('mouseenter:navigation-item')"
  >
    <div
      v-if="iconUrl"
      class="flex items-center gap-2"
      data-testid="navigation-item"
    >
      <object
        v-if="iconUrl"
        :data="iconUrl"
        type="image/svg+xml"
        :aria-labelledby="`${navigationItem.id}`"
        aria-hidden="true"
        role="presentation"
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
import { useRuntimeConfig } from '#app/nuxt'
import type { LinkVariant } from '#storefront-ui'
import { useRouteHelpers } from '~/composables'
import { SFLink } from '#storefront-ui/components'
import { theme } from '#tailwind-config'

const {
  navigationItem,
  raw = false,
  isActive = false,
  textColor,
  backgroundColor,
  disabledLink,
} = defineProps<{
  navigationItem: NavigationTreeItem
  variant?: LinkVariant
  raw?: boolean
  isActive?: boolean
  disabledLink?: boolean
  textColor?: `#${string}`
  backgroundColor?: `#${string}`
}>()

const { buildNavigationTreeItemRoute } = useRouteHelpers()

const {
  public: { cdnUrl },
} = useRuntimeConfig()

const iconUrl = computed(() => {
  const assets = Object.values(navigationItem?.assets ?? {})
  const icon = assets.find((asset) => asset.endsWith('svg'))
  if (!cdnUrl || !icon) {
    return
  }
  return URL.parse(icon, cdnUrl)?.toString()
})

const emit = defineEmits<{ 'mouseenter:navigation-item': [] }>()

const pathParams = computed(() => {
  return buildNavigationTreeItemRoute(navigationItem)
})
const displayName = computed(() => navigationItem.name)
const disabled = computed<boolean>(() =>
  disabledLink ? disabledLink : !!navigationItem.customData?.disabledLink,
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
  return pathParams.value?.route && !disabled.value
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
