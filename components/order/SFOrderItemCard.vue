<template>
  <div
    class="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-5"
  >
    <div class="flex flex-col text-base text-gray-600">
      <SFHeadline
        class="mb-3 !font-semi-bold-variable text-gray-900"
        data-testid="order-item-headline"
        size="md"
        tag="h3"
      >
        {{ $t('my_account.orders.detail.title', { id }) }}
      </SFHeadline>
      <span v-if="confirmedAt" class="mb-1">
        {{ $t('my_account.orders.order_date') }}:
        {{ formatLocaleDate(confirmedAt) }}
      </span>
      <span v-if="itemCount">
        {{ $t('my_account.orders.items_count') }}: {{ itemCount }}
      </span>
    </div>
    <SFButton
      :to="getOrderDetailsRoute(id)"
      :data-testid="`go-to-order-detail-${id}`"
      :aria-label="$t('my_account.orders.detail.go_to_order')"
      variant="tertiary"
      class="mr-0.5 !size-10 !p-0"
    >
      <IconChevronRight aria-hidden="true" class="size-4" />
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { SFHeadline, SFButton } from '#storefront-ui/components'
import { useFormatDate, useRouteHelpers } from '~/composables'

const { formatLocaleDate } = useFormatDate()
const { getOrderDetailsRoute } = useRouteHelpers()

const { id, confirmedAt, itemCount } = defineProps<{
  id: number
  confirmedAt?: string
  itemCount?: number
}>()
</script>
