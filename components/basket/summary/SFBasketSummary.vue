<template>
  <section
    class="hidden max-w-88 flex-col gap-4 text-base font-variable leading-3.5 lg:flex"
  >
    <SFHeadline tag="h1" data-testid="headline">
      {{ $t('basket.total') }}
    </SFHeadline>
    <div class="flex justify-between">
      <h2>{{ $t('basket.subtotal') }}</h2>
      <span v-if="totalCost">
        {{ formatCurrency(totalCost) }}
      </span>
    </div>
    <div class="flex justify-between">
      <h2>{{ $t('basket.delivery') }}</h2>
      <span>
        {{ $t('price.starting_from') }}
        {{ formatCurrency(0) }}*
      </span>
    </div>
    <template v-if="cost && items?.length">
      <SFFadeInFromBottomTransition>
        <SFBasketSummaryReductions
          v-if="hasReductions"
          :cost="cost"
          :basket-items="items"
        />
      </SFFadeInFromBottomTransition>
      <hr class="h-px border-none bg-gray-300" />
      <SFBasketSummaryFinalSection :cost="cost" :basket-items="items" />
    </template>
    <SFBasketSummaryVoucherDisclaimer />
    <p class="text-xs text-secondary">
      {{ $t('basket.summary.delivery_fees') }}
    </p>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import SFBasketSummaryReductions from './SFBasketSummaryReductions.vue'
import SFBasketSummaryFinalSection from './SFBasketSummaryFinalSection.vue'
import SFBasketSummaryVoucherDisclaimer from './SFBasketSummaryVoucherDisclaimer.vue'
import {
  SFHeadline,
  SFFadeInFromBottomTransition,
} from '#storefront-ui/components'
import { useFormatHelpers, useBasket } from '#storefront/composables'
import { useBasketReductions } from '~/composables'

const { cost, items } = await useBasket()

const totalCost = computed<number | undefined>(() => cost.value?.withTax)

const { hasReductions } = useBasketReductions(cost, items)

const { formatCurrency } = useFormatHelpers()
</script>
