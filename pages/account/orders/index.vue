<template>
  <SFAsyncDataWrapper :status="status">
    <SFEmptyState
      v-if="ordersCount === 0"
      :title="$t('my_account.orders.no_results.title')"
      :description="$t('my_account.orders.no_results.description')"
    />
    <div v-else>
      <SFHeadline
        tag="h2"
        data-testid="orders-headline"
        class="mb-5 !font-semi-bold-variable xl:mb-7"
      >
        {{ $t('my_account.orders.title') }}
        <span
          v-if="ordersCount"
          class="ml-1 inline-flex h-4.5 items-center rounded-full bg-gray-900 px-2 text-xs font-semibold leading-4 text-white"
        >
          {{ ordersCount }}
        </span>
      </SFHeadline>
      <SFOrderList :items="orders" :count="ordersCount" />
    </div>
    <NuxtPage />
    <template #loading>
      <SFOrderSkeletonLoader />
    </template>
  </SFAsyncDataWrapper>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useSeoMeta } from '@unhead/vue'
import { definePageMeta } from '#imports'
import SFEmptyState from '~/components/SFEmptyState.vue'
import { useI18n } from '#i18n'
import { NuxtPage } from '#components'
import { useUser } from '#storefront/composables'
import SFOrderSkeletonLoader from '~/components/order/SFOrderSkeletonLoader.vue'
import SFAsyncDataWrapper from '~/components/SFAsyncDataWrapper.vue'
import SFOrderList from '~/components/order/SFOrderList.vue'
import { SFHeadline } from '#storefront-ui/components'

const { t } = useI18n()

const { status, user } = useUser()

const orders = computed(() => user?.value?.orderSummary ?? [])

const ordersCount = computed(() => orders.value.length)

useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('my_account.orders.meta.title'),
  description: t('my_account.orders.meta.description'),
})

defineOptions({ name: 'OrderHistoryPage' })
definePageMeta({ pageType: 'account_area:orders' })
</script>
