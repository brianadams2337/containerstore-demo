<template>
  <div
    class="relative hidden w-2/5 border-l border-gray-300 bg-gray-100 px-5 py-8 pl-13 pr-7 lg:block"
  >
    <section
      class="sticky top-8 flex max-w-96 flex-col gap-4 text-md leading-4"
    >
      <SFHeadline tag="h2" data-testid="headline">
        {{ $t('basket_summary.total') }}
      </SFHeadline>
      <div class="flex justify-between">
        <h2>{{ $t('basket_summary.subtotal') }}</h2>
        <span v-if="subtotal" data-testid="basket-price-subtotal">
          {{ formatCurrency(subtotal) }}
        </span>
      </div>
      <div class="flex justify-between">
        <h2>{{ $t('basket_summary.delivery') }}</h2>
        <span>
          {{ deliveryCostsValue }}
        </span>
      </div>
      <SFFadeInFromBottomTransition>
        <SFBasketSummaryReductions
          v-if="basket.cost.appliedReductions.length > 0"
          :basket="basket"
        />
      </SFFadeInFromBottomTransition>
      <hr class="h-px border-none bg-gray-400" />
      <SFBasketSummaryFinalSection
        :cost="basket.cost"
        :basket-items="basket.items"
      />
      <SFBasketSummaryVoucherDisclaimer />
      <p class="text-xs text-secondary">
        {{ deliveryCostsDisclaimer }}
      </p>
    </section>
  </div>
  <SFBasketSummaryMobile :subtotal="subtotal" :basket="basket" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { BasketResponseData } from '@scayle/storefront-nuxt'
import SFBasketSummaryReductions from './SFBasketSummaryReductions.vue'
import SFBasketSummaryFinalSection from './SFBasketSummaryFinalSection.vue'
import SFBasketSummaryVoucherDisclaimer from './SFBasketSummaryVoucherDisclaimer.vue'
import SFBasketSummaryMobile from './SFBasketSummaryMobile.vue'
import {
  SFHeadline,
  SFFadeInFromBottomTransition,
} from '#storefront-ui/components'
import { useFormatHelpers } from '#storefront/composables'
import { getTotalPriceWithoutReductions } from '#storefront-basket/utils/basket'
import { useShopConfigCustomData } from '~/composables'

const { basket } = defineProps<{ basket: BasketResponseData }>()

const subtotal = computed(() => getTotalPriceWithoutReductions(basket.cost))

const { formatCurrency } = useFormatHelpers()

const { deliveryCostsValue, deliveryCostsDisclaimer } =
  useShopConfigCustomData()
</script>
