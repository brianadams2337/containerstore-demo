<template>
  <div
    class="m-auto flex max-w-200 flex-col items-start justify-center pt-6 *:w-full max-lg:px-4 lg:pt-10"
  >
    <SFHeadline
      class="mb-5 text-gray-900 lg:mb-7"
      size="xl"
      tag="h1"
      data-testid="account-headline"
    >
      {{ t('my_account.title') }}
    </SFHeadline>
    <SFAccountTabs />
    <hr class="mb-6 mt-4 h-px bg-gray-200" aria-hidden="true" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { defineOptions } from 'vue'
import { definePageMeta } from '#imports'
import { useI18n } from '#i18n'
import { NuxtPage } from '#components'
import SFAccountTabs from '~/components/account/SFAccountTabs.vue'
import { SFHeadline } from '#storefront-ui/components'
import { useRouteHelpers } from '~/composables'
import { routeList } from '~/utils/route'

const { t } = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('my_account.meta.title'),
  description: t('my_account.meta.description'),
})

defineOptions({ name: 'AccountArea' })
definePageMeta({
  pageType: 'account_area',
  middleware: (to) => {
    const { localizedNavigateTo, getLocalizedRoute } = useRouteHelpers()
    if (getLocalizedRoute(routeList.account.path) === to.fullPath) {
      return localizedNavigateTo(routeList.orders)
    }
  },
})
</script>
