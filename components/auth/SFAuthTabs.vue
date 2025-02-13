<template>
  <div class="flex items-center justify-start gap-x-3">
    <SFLocalizedLink
      v-for="({ to, title }, index) in tabs"
      :key="`${title}-${index}`"
      class="inline-block w-fit rounded-md px-2 py-1.5 text-lg font-semi-bold-variable tracking-tighter text-gray-500 duration-300 ease-out hover:bg-gray-100 focus-visible:transition-none"
      :class="{ 'bg-gray-100 text-gray-900': isActive(to) }"
      raw
      :to="to"
    >
      <h2>{{ title }}</h2>
    </SFLocalizedLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFLocalizedLink from '../SFLocalizedLink.vue'
import type { RouteLocationRaw } from '#vue-router'
import { routeList } from '~/utils/route'
import { useRouteHelpers } from '~/composables'
import { useRoute } from '#app/composables/router'
import { useI18n } from '#i18n'

const { t } = useI18n()

const route = useRoute()

const redirectUrl = computed(() => route.query.redirectUrl)

const tabs = computed(() => {
  const items = [
    {
      to: routeList.signin,
      title: t('sign_in_page.login.title'),
    },
    {
      to: routeList.signup,
      title: t('sign_in_page.sign_up.title'),
    },
  ]

  return items.map((item) => {
    const query = {
      ...item.to.query,
      // Attach redirect URL (checkout route) if exists when changing the tabs
      ...(redirectUrl.value && { redirectUrl: redirectUrl.value as string }),
    }
    return { ...item, to: { ...item.to, query } }
  })
})

const { getLocalizedRoute } = useRouteHelpers()

const isActive = (to: RouteLocationRaw) => {
  return getLocalizedRoute(to) === route.fullPath
}
</script>
