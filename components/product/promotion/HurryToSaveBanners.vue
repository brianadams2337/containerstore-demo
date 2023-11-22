<template>
  <div
    v-if="promotionEngineFeatureEnabled && applicablePromotions.length"
    class="flex flex-col"
  >
    <div
      v-if="automaticDiscountPromotion"
      class="mb-2 flex h-fit items-center justify-between rounded-md bg-blue px-2 py-1 text-xs font-semibold text-white"
      :style="
        getBackgroundColorStyle(automaticDiscountPromotion.customData.colorHex)
      "
    >
      <Headline tag="h2" size="xs" is-bold is-uppercase>
        {{ $t('promotion.hurry_to_save') }}
        {{ automaticDiscountPromotion.customData.product?.badgeLabel }}
      </Headline>
      <PromotionCountdown
        :until="automaticDiscountPromotion.schedule.to"
        borderless
      />
    </div>
    <div
      v-if="buyXGetYPromotion"
      class="flex h-fit items-center justify-between rounded-md bg-blue px-2 py-1 text-xs font-semibold text-white"
      :style="getBackgroundColorStyle(buyXGetYPromotion.customData.colorHex)"
    >
      <Headline tag="h2" size="xs" is-bold is-uppercase>
        {{ $t('promotion.save_your_free_gift') }}
      </Headline>
      <PromotionCountdown :until="buyXGetYPromotion.schedule.to" borderless />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { automaticDiscountPromotion, buyXGetYPromotion, applicablePromotions } =
  await useProductPromotions(props.product)

const { promotionEngineFeatureEnabled } = useRuntimeConfig().public
</script>
