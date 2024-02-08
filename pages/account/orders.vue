<template>
  <AccountWrapper
    :title="
      $route.params?.id
        ? getBreadcrumbTitle(+$route.params?.id)
        : $t('my_account.orders.overview')
    "
  >
    <div v-show="$route.params.id">
      <NuxtPage />
    </div>
  </AccountWrapper>
</template>

<script setup lang="ts">
const { user } = await useUser()
const { $i18n } = useNuxtApp()

const orders = computed(() => user.value?.orderSummary ?? [])

const getBreadcrumbTitle = (id: number) => {
  const order = orders.value.find((order) => order.id === id)
  return order
    ? `${order.shopId}-${order.id}`
    : $i18n.t('my_account.orders.overview')
}

defineOptions({ name: 'OrderHistoryPage' })
definePageMeta({ pageType: 'account_area:orders' })
</script>
