<template>
  <!-- Mobile needs to be implemented as Vue fragments in order to enable sticky
      behavior for basket summary final price and checkout button. -->
  <section
    class="flex w-full flex-col gap-4 border-t border-gray-300 bg-gray-100 px-5 pb-4 pt-8 text-md leading-4 lg:hidden"
  >
    <SFHeadline tag="h2" data-testid="headline">
      {{ $t('basket_summary.total') }}
    </SFHeadline>
    <div class="flex justify-between">
      <h2>{{ $t('basket_summary.subtotal') }}</h2>
      <span v-if="subtotal" data-testid="basket-price-subtotal-mobile">
        {{ formatCurrency(subtotal) }}
      </span>
    </div>
    <div class="flex justify-between">
      <h2>{{ $t('basket_summary.delivery') }}</h2>
      <span>
        {{ deliveryCostsValue }}
      </span>
    </div>
  </section>
  <SFBasketSummaryReductions
    v-if="basket.cost.appliedReductions.length > 0"
    :basket="basket"
    class="bg-gray-100 px-5 pb-4 lg:hidden"
  />
  <div
    class="sticky bottom-0 z-10 flex flex-col gap-4 border-gray-300 bg-gray-100 pb-5 lg:hidden"
  >
    <hr class="h-px w-full border-none bg-gray-400" />
    <SFBasketSummaryFinalSection
      :cost="basket.cost"
      :basket-items="basket.items"
      class="px-5"
    />
  </div>
  <div class="bg-gray-100 px-5 pb-5 lg:hidden">
    <SFBasketPromotionCodes />
  </div>
  <p class="bg-gray-100 px-5 pb-8 text-sm text-secondary lg:hidden">
    {{ deliveryCostsDisclaimer }}
  </p>
</template>

<script lang="ts" setup>
import type { BasketResponseData } from '@scayle/storefront-nuxt'
import SFBasketPromotionCodes from '../SFBasketPromotionCodes.vue'
import SFBasketSummaryFinalSection from './SFBasketSummaryFinalSection.vue'
import SFBasketSummaryReductions from './SFBasketSummaryReductions.vue'
import { SFHeadline } from '#storefront-ui/components'
import { useFormatHelpers } from '#storefront/composables'
import { useShopConfigCustomData } from '~/composables'

const { basket, subtotal } = defineProps<{
  basket: BasketResponseData
  subtotal?: number
}>()

const { formatCurrency } = useFormatHelpers()
const { deliveryCostsValue, deliveryCostsDisclaimer } =
  useShopConfigCustomData()
</script>
