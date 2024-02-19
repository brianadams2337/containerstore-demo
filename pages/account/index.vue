<template>
  <div>
    <AccountHeader
      :title="$t('navigation.my_account')"
      icon="IconUserSecondary"
    />
    <div
      v-if="user"
      class="flex flex-col justify-center space-x-0 space-y-4 px-4 py-8 sm:flex-row sm:space-x-8 sm:space-y-0"
    >
      <ContainerLink
        :to="routeList.orders"
        :header="$t('my_account.orders_menu')"
        :subheader="$t('my_account.orders_count', { count: orderCount })"
        class="w-full"
      />
      <ContainerLink
        :to="routeList.user"
        :header="$t('my_account.profile_menu')"
        :subheader="$t('my_account.personal_data_title')"
        class="w-full"
      />
    </div>
    <div class="mt-2 px-4">
      <LogoutButton data-test-id="add-item-to-basket-button" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = await useUser()

const { $i18n } = useNuxtApp()

const orderCount = computed(() => user.value?.orderSummary?.length || 0)

useSeoMeta({ robots: 'index,follow', title: $i18n.t('navigation.my_account') })

defineOptions({ name: 'AccountOverview' })
definePageMeta({ pageType: 'account_area' })
</script>
