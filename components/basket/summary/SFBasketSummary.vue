<template>
  <div
    class="relative hidden w-2/5 border-l border-gray-200 bg-gray-50 px-5 py-8 pl-13 pr-7 lg:block"
  >
    <section
      class="sticky top-8 flex max-w-88 flex-col gap-4 text-base font-variable leading-3.5"
    >
      <SFHeadline tag="h2" data-testid="headline">
        {{ $t('basket.total') }}
      </SFHeadline>
      <div class="flex justify-between">
        <h2>{{ $t('basket.subtotal') }}</h2>
        <span v-if="subtotal" data-testid="basket-price-subtotal">
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
      <SFFadeInFromBottomTransition>
        <SFBasketSummaryReductions
          v-if="cost.appliedReductions.length > 0"
          :cost="cost"
          :basket-items="basketItems"
        />
      </SFFadeInFromBottomTransition>
      <hr class="h-px border-none bg-gray-300" />
      <SFBasketSummaryFinalSection :cost="cost" :basket-items="basketItems" />
      <SFBasketSummaryVoucherDisclaimer />
      <p class="text-xs text-secondary">
        {{ $t('basket.summary.delivery_fees') }}
      </p>
    </section>
  </div>
  <SFBasketSummaryMobile
    :cost="cost"
    :basket-items="basketItems"
    :subtotal="subtotal"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { BasketTotalPrice, BasketItem } from '@scayle/storefront-nuxt'
import SFBasketSummaryReductions from './SFBasketSummaryReductions.vue'
import SFBasketSummaryFinalSection from './SFBasketSummaryFinalSection.vue'
import SFBasketSummaryVoucherDisclaimer from './SFBasketSummaryVoucherDisclaimer.vue'
import SFBasketSummaryMobile from './SFBasketSummaryMobile.vue'
import {
  SFHeadline,
  SFFadeInFromBottomTransition,
} from '#storefront-ui/components'
import { useFormatHelpers } from '#storefront/composables'
import { getTotalPriceWithoutReductions } from '~/utils'

const { cost, basketItems } = defineProps<{
  cost: BasketTotalPrice
  basketItems: BasketItem[]
}>()

const subtotal = computed(() => getTotalPriceWithoutReductions(cost))

const { formatCurrency } = useFormatHelpers()
</script>
