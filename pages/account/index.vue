<template>
  <div class="container my-0 overflow-hidden px-0 max-sm:max-w-none">
    <AccountHeader
      :title="$t('navigation.my_account')"
      icon="IconUserSecondary"
    />
    <SFPageContainer>
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
        <LogoutButton data-testid="logout-button" />
      </div>
    </SFPageContainer>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { computed, defineOptions, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import {
  useTrackingEvents,
  wishlistListingMetadata,
  useRouteHelpers,
} from '~/composables'
import { useNuxtApp } from '#app'
import { useUser, useWishlist } from '#storefront/composables'
import { routeList } from '~/utils/route'
import AccountHeader from '~/components/account/AccountHeader.vue'
import LogoutButton from '~/components/auth/LogoutButton.vue'
import {
  SFContainerLink,
  SFPageContainer,
  SFSkeletonLoader,
} from '#storefront-ui/components'

const { user } = useUser()
const wishlist = await useWishlist()

const { trackWishlist, collectProductListItems } = useTrackingEvents()

const { getLocalizedRoute } = useRouteHelpers()

const { $i18n } = useNuxtApp()

const orderCount = computed(() => user.value?.orderSummary?.length || 0)

onMounted(() => {
  trackWishlist(
    collectProductListItems(wishlist.products.value, {
      listId: wishlistListingMetadata.id,
      listName: wishlistListingMetadata.name,
    }),
  )
})

useSeoMeta({ robots: 'index,follow', title: $i18n.t('navigation.my_account') })

defineOptions({ name: 'AccountOverview' })
definePageMeta({ pageType: 'account_area' })
</script>
