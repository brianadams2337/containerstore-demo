<template>
  <div class="flex w-full items-center justify-start gap-x-3">
    <SFLocalizedLink
      v-for="({ to, title }, index) in tabs"
      :key="`${title}-${index}`"
      class="inline-block w-fit rounded-md px-2 py-1.5 text-lg font-semi-bold-variable tracking-tighter text-gray-500 duration-300 ease-out hover:bg-gray-100 focus-visible:transition-none"
      :class="{ 'rounded bg-gray-100 text-gray-900': isActive(to) }"
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

const tabs = computed(() => [
  {
    to: routeList.signin,
    title: t('sign_in_page.login.title'),
  },
  {
    to: routeList.signup,
    title: t('sign_in_page.sign_up.title'),
  },
])

const route = useRoute()

const { getLocalizedRoute } = useRouteHelpers()

const isActive = (to: RouteLocationRaw) => {
  return getLocalizedRoute(to) === route.fullPath
}
</script>
