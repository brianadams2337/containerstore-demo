<template>
  <AuthGuard>
    <AccountHeader
      :title="$t('navigation.my_account')"
      icon="IconUserSecondary" />
    <div
      v-if="user"
      class="flex flex-col justify-center space-x-0 space-y-4 px-4 py-8 sm:flex-row sm:space-x-8 sm:space-y-0">
      <ContainerLink
        :to="{ name: routeList.orders.name }"
        :header="$t('my_account.orders_menu')"
        :subheader="$t('my_account.orders_count', { count: orderCount })"
        class="w-full" />
      <ContainerLink
        :to="{ name: routeList.user.name }"
        :header="$t('my_account.profile_menu')"
        :subheader="$t('my_account.personal_data_title')"
        class="w-full" />
    </div>
    <div class="mt-2 px-4">
      <LogoutButton data-test-id="add-item-to-basket-button" />
    </div>
  </AuthGuard>
</template>

<script setup lang="ts">
const { user } = await useUser()

const orderCount = computed(() => user.value?.orderSummary?.length || 0)

definePageMeta({ pageType: 'account_area' })
</script>

<script lang="ts">
export default {
  name: 'AccountOverview',
}
</script>
