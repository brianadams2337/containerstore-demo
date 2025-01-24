<template>
  <!-- Mobile needs to be implemented as Vue fragments in order to enable sticky
      behavior for basket summary final price and checkout button. -->
  <section
    class="flex w-full flex-col gap-4 border-t border-gray-200 bg-gray-50 px-5 pb-4 pt-8 text-base font-variable leading-3.5 lg:hidden"
  >
    <SFHeadline tag="h2" data-testid="headline">
      {{ $t('basket.total') }}
    </SFHeadline>
    <div class="flex justify-between">
      <h2>{{ $t('basket.subtotal') }}</h2>
      <span v-if="subtotal" data-testid="basket-price-subtotal-mobile">
        {{ formatCurrency(subtotal) }}
      </span>
    </div>
    <div class="flex justify-between">
      <h2>{{ $t('basket.delivery') }}</h2>
      <span>
        {{ $t('price.starting_from') }}
        {{ formatCurrency(0) }}*
      </span>
    </div>
  </section>
  <SFBasketSummaryReductions
    v-if="cost.appliedReductions.length > 0"
    :cost="cost"
    :basket-items="basketItems"
    class="bg-gray-50 px-5 pb-4 lg:hidden"
  />
  <div
    class="sticky bottom-0 z-10 flex flex-col gap-4 border-gray-200 bg-gray-50 pb-5 lg:hidden"
  >
    <hr class="h-px w-full border-none bg-gray-300" />
    <SFBasketSummaryFinalSection
      :cost="cost"
      :basket-items="basketItems"
      class="px-5"
    />
  </div>
  <div class="bg-gray-50 px-5 pb-5 lg:hidden">
    <SFBasketSummaryVoucherDisclaimer />
  </div>
  <p class="bg-gray-50 px-5 pb-8 text-xs text-secondary lg:hidden">
    {{ $t('basket.summary.delivery_fees') }}
  </p>
</template>

<script lang="ts" setup>
import type { BasketTotalPrice, BasketItem } from '@scayle/storefront-nuxt'
import SFBasketSummaryFinalSection from './SFBasketSummaryFinalSection.vue'
import SFBasketSummaryReductions from './SFBasketSummaryReductions.vue'
import SFBasketSummaryVoucherDisclaimer from './SFBasketSummaryVoucherDisclaimer.vue'
import { SFHeadline } from '#storefront-ui/components'
import { useFormatHelpers } from '#storefront/composables'

const { cost, basketItems, subtotal } = defineProps<{
  cost: BasketTotalPrice
  basketItems: BasketItem[]
  subtotal?: number
}>()

const { formatCurrency } = useFormatHelpers()
</script>
