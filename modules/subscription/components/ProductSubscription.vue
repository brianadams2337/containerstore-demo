<template>
  <div class="relative max-md:pt-1.5">
    <div
      class="text-center text-gray-500 max-md:absolute max-md:left-1/2 max-md:z-10 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:rounded-full max-md:border max-md:border-gray-300 max-md:bg-white max-md:text-sm md:mb-5 md:flex md:w-full md:items-center md:space-x-3"
    >
      <div class="h-px w-full bg-gray-300 max-md:hidden" />
      <span class="shrink-0 px-5 max-md:py-1 md:px-3">
        {{ $t('subscription.or') }}
      </span>
      <div class="h-px w-full bg-gray-300 max-md:hidden" />
    </div>

    <div
      class="space-y-5 border-y border-gray-300 px-5 pb-10 pt-11 max-md:bg-white-smoke md:rounded-lg md:border md:border-accent md:py-5"
    >
      <div
        class="text-2xl font-medium text-gray-900 md:text-md md:font-semi-bold-variable"
      >
        {{ $t('subscription.subscribe') }}
      </div>

      <div v-if="!subscriptionPrice" class="text-md text-gray-500">
        {{ $t('subscription.select_size_message') }}
      </div>
      <div
        v-else-if="subscriptionPrice && !subscriptionVariantEligible"
        class="text-md text-gray-500"
      >
        {{ $t('subscription.not_eligible_message') }}
      </div>
      <ProductPrice
        v-else
        :promotion="automaticDiscountPromotion"
        size="lg"
        type="normal"
        :price="subscriptionPrice"
        :applied-reductions="subscriptionPrice?.appliedReductions"
        show-tax-info
      />

      <SFFadeInTransition :duration="150">
        <LazyProductSubscriptionSelection
          v-if="variant && subscriptionVariantEligible"
          :product="product"
          :variant="variant"
          :preferred-delivery-date="preferredDeliveryDate"
          :price-promotion-key="pricePromotionKey"
          @add-item-to-basket="$emit('addItemToBasket', $event)"
        />
      </SFFadeInTransition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue'
import type { Product, Variant } from '@scayle/storefront-nuxt'
import { useSubscription } from '../composables/useSubscription'
import type { PreferredDeliveryDate } from '../helpers/subscription'
import { useProductPromotions } from '~/composables/useProductPromotions'

type Props = {
  product: Product
  variant?: Variant
  preferredDeliveryDate?: Array<PreferredDeliveryDate>
  pricePromotionKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  preferredDeliveryDate: () => [
    { day: 1, label: 'day_of_month_selection_caption' },
    { day: 15, label: 'day_of_month_selection_caption' },
  ],
  pricePromotionKey: 'subscription',
  variant: undefined,
})

defineEmits(['addItemToBasket'])

const { product, variant, pricePromotionKey } = toRefs(props)
const {
  selectedPreferredDeliveryDate,
  subscriptionPrice,
  subscriptionVariantEligible,
} = useSubscription(
  product,
  pricePromotionKey,
  variant,
  'product-subscription.vue',
)

selectedPreferredDeliveryDate.value = props.preferredDeliveryDate[0]

const { automaticDiscountPromotion } = useProductPromotions(product)
</script>
