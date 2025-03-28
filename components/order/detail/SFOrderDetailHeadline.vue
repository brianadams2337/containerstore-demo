<template>
  <div class="flex items-center gap-4">
    <SFButton
      variant="raw"
      fab
      size="sm"
      class="size-10 border border-gray-200"
      data-testid="back-to-order-list"
      :aria-label="$t('my_account.orders.detail.back')"
      :to="getLocalizedRoute(routeList.orders)"
    >
      <IconChevronLeft aria-hidden="true" class="size-4 text-gray-500" />
    </SFButton>
    <SFHeadline tag="h2" data-testid="order-detail-headline">
      {{ $t('my_account.orders.detail.title', { id }) }}
    </SFHeadline>
  </div>
</template>

<script setup lang="ts">
import { SFHeadline, SFButton } from '#storefront-ui/components'
import { routeList } from '~/utils'
import { useRouteHelpers } from '~/composables'

const { id } = defineProps<{ id: number }>()

const { getLocalizedRoute } = useRouteHelpers()
</script>
