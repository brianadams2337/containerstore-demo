<template>
  <div class="container my-0 overflow-hidden px-0 max-sm:max-w-none">
    <SFAccountHeader
      :title="$t('navigation.my_account')"
      icon="IconUserSecondary"
    />
    <SFPageContainer>
      <SFHeadline class="mb-10 max-md:hidden" size="xl" tag="h1">
        {{ $t('navigation.my_account') }}
      </SFHeadline>
      <div
        v-if="user"
        class="flex flex-col justify-center space-x-0 space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0"
      >
        <SFContainerLink
          :to="getLocalizedRoute(routeList.orders)"
          :header="$t('my_account.orders_menu')"
          :sub-header="$t('my_account.orders_count', { count: orderCount })"
          class="w-full"
        />
        <SFContainerLink
          :to="getLocalizedRoute(routeList.user)"
          :header="$t('my_account.profile_menu')"
          :sub-header="$t('my_account.personal_data_title')"
          class="w-full"
        />
        <SFContainerLink
          :to="getLocalizedRoute(routeList.subscriptionOverview)"
          :header="$t('my_account.subscriptions_menu')"
          :sub-header="$t('my_account.subscriptions_subtitle')"
          class="w-full"
        />
      </div>
      <div
        v-else
        class="flex flex-col justify-center space-x-0 space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0"
      >
        <SFSkeletonLoader
          v-for="i in 3"
          :key="i"
          full-width
          class="mt-2.5 h-20"
        />
      </div>
      <div class="mx-auto mt-12 w-fit">
        <SFLogoutButton data-testid="logout-button" />
      </div>
    </SFPageContainer>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { computed, defineOptions } from 'vue'
import { definePageMeta } from '#imports'
import { useRouteHelpers } from '~/composables'
import { useUser } from '#storefront/composables'
import { routeList } from '~/utils/route'
import SFAccountHeader from '~/components/account/SFAccountHeader.vue'
import SFLogoutButton from '~/components/auth/SFLogoutButton.vue'
import {
  SFContainerLink,
  SFPageContainer,
  SFSkeletonLoader,
  SFHeadline,
} from '#storefront-ui/components'
import { useI18n } from '#i18n'

const { user } = useUser()

const { getLocalizedRoute } = useRouteHelpers()

const { t } = useI18n()

const orderCount = computed(() => user.value?.orderSummary?.length || 0)

useSeoMeta({ robots: 'index,follow', title: t('navigation.my_account') })

defineOptions({ name: 'AccountOverview' })
definePageMeta({ pageType: 'account_area' })
</script>
