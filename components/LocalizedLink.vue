<template>
  <SFLink v-bind="attributes" :to="getLocalizedRoute(to)">
    <slot />
  </SFLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'
import type { LinkVariant } from '#storefront-ui'
import { SFLink } from '#storefront-ui/components'
import { useRouteHelpers } from '~/composables'

type Props = {
  to: RouteLocationRaw
  onlyExactActive?: boolean
  variant?: LinkVariant
  openInNewTab?: boolean
  raw?: boolean
  target?: '_self' | '_blank' | '_parent' | '_top'
}

const { to, ...attributes } = defineProps<Props>()

const { getLocalizedRoute } = useRouteHelpers()
</script>
