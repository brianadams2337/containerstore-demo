<template>
  <div class="flex items-center gap-4">
    <SFButton
      variant="raw"
      fab
      size="sm"
      class="size-10 border border-gray-200"
      data-testid="back-to-order-list"
      :aria-label="$t('my_account.orders.detail.back')"
      :to="link"
    >
      <IconChevronLeft class="size-4 text-gray-500" />
    </SFButton>
    <SFHeadline tag="h2" data-testid="order-detail-headline">
      {{ $t('my_account.orders.detail.title', { id }) }}
    </SFHeadline>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SFHeadline, SFButton } from '#storefront-ui/components'
import { routeList } from '~/utils'
import { useRouteHelpers } from '~/composables'
import { useRouter } from '#app/composables/router'

const { id } = defineProps<{ id: number }>()

const { options } = useRouter()

const link = computed(() => {
  const previousRoute = (options?.history?.state?.back as string) ?? ''
  return previousRoute.includes(routeList.orders.path)
    ? previousRoute
    : getLocalizedRoute(routeList.orders)
})

const { getLocalizedRoute } = useRouteHelpers()
</script>
