<template>
  <div class="container my-0 overflow-hidden px-0 max-sm:max-w-none">
    <AccountHeader
      :title="$t('navigation.my_account')"
      icon="IconUserSecondary"
    />
    <PageContent>
      <div
        v-if="user"
        class="flex flex-col justify-center space-x-0 space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0"
      >
        <SFContainerLink
          :to="routeList.orders"
          :header="$t('my_account.orders_menu')"
          :sub-header="$t('my_account.orders_count', { count: orderCount })"
          class="w-full"
        />
        <SFContainerLink
          :to="routeList.user"
          :header="$t('my_account.profile_menu')"
          :sub-header="$t('my_account.personal_data_title')"
          class="w-full"
        />
        <SFContainerLink
          :to="routeList.subscriptionOverview"
          :header="$t('my_account.subscriptions_menu')"
          :sub-header="$t('my_account.subscriptions_subtitle')"
          class="w-full"
        />
      </div>
      <div class="mt-4">
        <LogoutButton data-test-id="add-item-to-basket-button" />
      </div>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { computed, defineOptions, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { useTrackingEvents, wishlistListingMetadata } from '~/composables'
import { useNuxtApp } from '#app/nuxt'
import { useUser, useWishlist } from '#storefront/composables'
import { routeList } from '~/utils/route'

const { user } = await useUser()
const wishlist = await useWishlist()

const { trackWishlist, collectProductListItems } = useTrackingEvents()

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
