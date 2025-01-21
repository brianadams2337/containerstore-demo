<template>
  <section class="flex flex-col gap-4">
    <div class="flex items-start justify-between">
      <SFHeadline tag="h2" size="lg">{{ $t('basket.you_pay') }}</SFHeadline>
      <div class="mb-1 flex flex-col gap-1 text-xs font-variable text-gray-600">
        <SFHeadline tag="span" size="lg" class="text-primary">
          {{ formatCurrency(cost.withTax) }}
        </SFHeadline>
        <span v-if="tax > 0">{{ $t('basket.including_vat') }}</span>
        <span v-if="tax === 0">{{ $t('basket.excluding_vat') }}</span>
      </div>
    </div>
    <SFButton
      data-testid="checkout-link"
      size="xl"
      is-full-width
      variant="accent"
      @click="goToCheckout"
    >
      {{ $t('basket.checkout_label') }}
    </SFButton>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { BasketTotalPrice, BasketItem } from '@scayle/storefront-nuxt'
import { SFHeadline, SFButton } from '#storefront-ui/components'
import { useFormatHelpers } from '#storefront/composables'
import { useRouteHelpers, useTrackingEvents } from '~/composables'
import { routeList } from '~/utils/route'
import { BasketListingMetadata } from '~/constants/listingMetadata'

const { cost, basketItems } = defineProps<{
  cost: BasketTotalPrice
  basketItems: BasketItem[]
}>()

const { trackBeginCheckout } = useTrackingEvents()
const { localizedNavigateTo } = useRouteHelpers()

const { formatCurrency } = useFormatHelpers()

const tax = computed<number>(() => cost.tax.vat.amount)

const goToCheckout = async () => {
  trackBeginCheckout(
    basketItems,
    BasketListingMetadata.NAME,
    BasketListingMetadata.ID,
  )

  await localizedNavigateTo(routeList.checkout)
}
</script>
