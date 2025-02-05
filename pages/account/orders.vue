<template>
  <SFAccountWrapper
    :title="
      $route.params?.id
        ? getBreadcrumbTitle(+$route.params?.id)
        : $t('my_account.orders.overview')
    "
  >
    <div v-show="$route.params.id">
      <NuxtPage />
    </div>
  </SFAccountWrapper>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import { useI18n } from '#i18n'
import { useUser } from '#storefront/composables'
import SFAccountWrapper from '~/components/account/SFAccountWrapper.vue'
import { NuxtPage } from '#components'

const { user } = useUser()

const { t } = useI18n()

const orders = computed(() => user.value?.orderSummary ?? [])

const getBreadcrumbTitle = (id: number) => {
  const order = orders.value.find((order) => order.id === id)
  return order ? `${order.shopId}-${order.id}` : t('my_account.orders.overview')
}

useSeoMeta({
  robots: 'index,follow',
  title: t('navigation.my_orders'),
})

defineOptions({ name: 'OrderHistoryPage' })
definePageMeta({ pageType: 'account_area:orders' })
</script>
