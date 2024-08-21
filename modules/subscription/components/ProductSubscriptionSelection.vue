<template>
  <div class="flex w-full flex-col gap-4 p-2">
    <div
      v-if="subscriptionState.isInitial"
      class="p-8 text-center text-secondary"
    >
      {{ $t('subscription.select_size_message') }}
    </div>
    <div
      v-else-if="subscriptionState.isEligible"
      class="flex w-full flex-col gap-4"
    >
      <ProductPrice
        v-if="subscriptionPrice"
        :promotion="automaticDiscountPromotion"
        size="xl"
        type="normal"
        :price="subscriptionPrice"
        :applied-reductions="subscriptionPrice?.appliedReductions"
        show-tax-info
      />
      <div>
        <div class="text-xs font-semibold">
          {{ $t('subscription.interval') }}
        </div>
        <SFDropdown
          v-model="selectedInterval"
          class="w-full"
          :items="subscriptionIntervals"
        >
          <template #default>
            {{ selectedInterval?.label }}
          </template>
          <template #item="{ item, selectItem }">
            <div
              :key="JSON.stringify(item)"
              class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300"
              @keydown.enter="selectItem(item)"
              @click="selectItem(item)"
            >
              {{ item.label }}
            </div>
          </template>
        </SFDropdown>
      </div>
      <div>
        <div class="text-xs font-semibold">
          {{ $t('subscription.follow_up_delivery') }}
        </div>
        <SFDropdown
          v-model="selectedPreferredDeliveryDate"
          class="w-full"
          :items="preferredDeliveryDate"
        >
          <template #default>
            {{
              $t('subscription.' + selectedPreferredDeliveryDate?.label, {
                dayOfMonth:
                  selectedPreferredDeliveryDate?.day +
                  $t(`global.ordinal_suffixes.${ordinalSuffixKey}`),
              })
            }}
          </template>
          <template #item="{ item, selectItem }">
            <div
              :key="JSON.stringify(item)"
              class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 active:bg-gray-300"
              @keydown.enter="selectItem(item)"
              @click="selectItem(item)"
            >
              {{
                $t('subscription.day_of_month_selection_caption', {
                  dayOfMonth:
                    item?.day +
                    $t(`global.ordinal_suffixes.${ordinalSuffixKey}`),
                })
              }}
            </div>
          </template>
        </SFDropdown>
      </div>
    </div>
    <div
      v-else-if="!subscriptionState.isEligible"
      class="p-8 text-center text-secondary"
    >
      {{ $t('subscription.not_eligible_message') }}
    </div>
    <SFButton
      data-testid="add-item-to-basket-button"
      is-full-width
      type="primary"
      :disabled="!subscriptionState.isEligible || product.isSoldOut"
      :title="product.isSoldOut ? $t('badge_labels.sold_out') : ''"
      class="text-sm !normal-case"
      @click="$emit('addItemToBasket', itemToAdd)"
    >
      {{ $t('pdp.add_label') }}
    </SFButton>
  </div>
</template>
<script setup lang="ts">
import { computed, toRefs, watch } from 'vue'
import type { Product, Variant } from '@scayle/storefront-nuxt'
import { useSubscription } from '../composables/useSubscription'
import type { PreferredDeliveryDate } from '../helpers/subscription'
import { useProductPromotions } from '~/composables'

type Props = {
  product: Product
  variant?: Variant
  preferredDeliveryDate: Array<PreferredDeliveryDate>
  pricePromotionKey: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: undefined,
})

defineEmits(['addItemToBasket'])

const { product, variant, pricePromotionKey } = toRefs(props)
const {
  subscriptionIntervals,
  selectedInterval,
  itemToAdd,
  selectedPreferredDeliveryDate,
  subscriptionPrice,
  subscriptionVariantEligible,
  ordinalSuffixKey,
} = useSubscription(
  product,
  pricePromotionKey,
  variant,
  'product-subscription-selection.vue',
)

const subscriptionState = computed(() => ({
  isInitial: !props.variant,
  isEligible: !!props.variant && subscriptionVariantEligible.value,
}))
const { automaticDiscountPromotion } = useProductPromotions(product)

watch(
  () => subscriptionIntervals.value,
  () => {
    if (!subscriptionIntervals.value.length) {
      selectedInterval.value = undefined
      return
    }

    const selectedIntervalIsInvalid = !subscriptionIntervals.value.some(
      (interval) => interval.value === selectedInterval.value,
    )

    selectedInterval.value = selectedIntervalIsInvalid
      ? subscriptionIntervals.value[0]
      : selectedInterval.value
  },
  { immediate: true },
)
</script>
