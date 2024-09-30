<template>
  <div class="flex w-full flex-col space-y-5 py-2">
    <div>
      <div class="mb-1.5 text-sm font-variable text-gray-500">
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
            {{ item?.label }}
          </div>
        </template>
      </SFDropdown>
    </div>
    <div>
      <div class="mb-1.5 text-sm font-variable text-gray-500">
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
                  item?.day + $t(`global.ordinal_suffixes.${ordinalSuffixKey}`),
              })
            }}
          </div>
        </template>
      </SFDropdown>
    </div>
    <SFButton
      type="accent"
      data-testid="add-item-to-basket-button"
      size="xl"
      :disabled="!subscriptionState.isEligible || product.isSoldOut"
      @click="$emit('addItemToBasket', itemToAdd)"
    >
      {{
        $t('subscription.add_to_basket', { interval: selectedInterval?.label })
      }}
    </SFButton>
  </div>
</template>
<script setup lang="ts">
import { computed, toRefs, watch } from 'vue'
import type { Product, Variant } from '@scayle/storefront-nuxt'
import { useSubscription } from '../composables/useSubscription'
import type { PreferredDeliveryDate } from '../helpers/subscription'
import type { AddToBasketItem } from '~/composables'
import { SFButton, SFDropdown } from '#storefront-ui/components'

type Props = {
  product: Product
  variant?: Variant
  preferredDeliveryDate: Array<PreferredDeliveryDate>
  pricePromotionKey: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: undefined,
})

defineEmits<{
  (e: 'addItemToBasket', item: AddToBasketItem | undefined): void
}>()

const { product, variant, pricePromotionKey } = toRefs(props)
const {
  subscriptionIntervals,
  selectedInterval,
  itemToAdd,
  selectedPreferredDeliveryDate,
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
