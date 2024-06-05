<template>
  <SFHorizontalItemsDivider v-if="breadcrumbs.length" :items="breadcrumbs">
    <template #default="{ items }">
      <template v-for="(link, idx) in items" :key="`breadcrumb-${idx}`">
        <SFLink
          :to="link.to"
          size="sm"
          type="quieter"
          class="capitalize !text-black hover:underline"
          only-exact-active
        >
          <SFHeadline v-if="isActive(link.to)" size="sm">
            {{ link.value }}
          </SFHeadline>
          <template v-else>
            {{ link.value }}
          </template>
        </SFLink>
        <span
          v-if="showDividerTag(idx, items.length)"
          :key="`span-${link.value}`"
          class="-ml-1 text-sm font-light"
        >
          /
        </span>
      </template>
    </template>
  </SFHorizontalItemsDivider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getBreadcrumbsFromPath } from '@scayle/storefront-nuxt'
import { useLink } from '#vue-router'
import { useRouteHelpers } from '~/composables'
import { useCurrentShop } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import { SFHeadline, SFHorizontalItemsDivider, SFLink } from '#components'
import { showDividerTag } from '#storefront-ui'

const route = useRoute()
const currentShop = useCurrentShop()
const { getLocalizedRoute } = useRouteHelpers()

const breadcrumbs = computed(() => {
  return getBreadcrumbsFromPath(route.path, currentShop.value?.path)
})

const isActive = (url: string) => {
  const { isExactActive } = useLink({ to: getLocalizedRoute(url) })

  return isExactActive.value
}
</script>
