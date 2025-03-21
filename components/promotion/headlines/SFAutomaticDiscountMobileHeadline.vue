<template>
  <div class="flex flex-col gap-y-1">
    <span v-if="headline.offerText" class="mr-2 text-xs font-bold uppercase">
      {{
        currentPromotion?.customData.product?.badgeLabel ?? headline.offerText
      }}
    </span>
    <h2
      class="inline-flex flex-wrap gap-x-[0.75ch] break-all text-xs font-medium"
    >
      {{ $t('promotion.automatic_discount_headline.add_label') }}
      <template v-if="progress > 0">
        {{ $t('promotion.automatic_discount_headline.another_label') }}
      </template>
      <span class="font-bold">{{ formattedAmountLeft }}</span>
      <span>
        {{ $t('promotion.automatic_discount_headline.save_indicator_label') }}
      </span>
      <span v-if="automaticDiscount" class="font-bold uppercase">
        {{
          $t('promotion.automatic_discount_headline.offer', {
            discount: automaticDiscount,
          })
        }}
      </span>
      <IconInfoOutline class="size-4" />
    </h2>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentPromotion, usePromotionProgress } from '~/composables'

const { automaticDiscount, headlineParts, currentPromotion } =
  useCurrentPromotion()

const headline = computed(() => {
  const [offerText, conditionText] = headlineParts.value ?? []

  return { offerText, conditionText }
})

const { progress, formattedAmountLeft } = usePromotionProgress(currentPromotion)
</script>
