<template>
  <section v-if="movPromotions.length" class="w-full lg:max-w-156">
    <SFPromotionCard
      v-for="promotion in movPromotions"
      :key="promotion.id"
      :promotion="promotion"
      :background-color="getBackgroundColor(promotion)"
      :style="getTextColorStyle(promotion.customData.colorHex)"
      :aria-label="getAriaLabel(promotion)"
      class="mb-2 flex w-full flex-col rounded-xl px-4 py-2 last:mb-0"
    >
      <template #default="{ headlineParts, scheduledTo }">
        <SFBasketMOVBannerContent
          :promotion="promotion"
          :headline-parts="headlineParts"
          :scheduled-to="scheduledTo"
          :color="promotion.customData.colorHex"
        />
      </template>
    </SFPromotionCard>
  </section>
</template>

<script setup lang="ts">
import SFBasketMOVBannerContent from './SFBasketMOVBannerContent.vue'
import { useBasketPromotions } from '~/composables'
import SFPromotionCard from '~/components/promotion/SFPromotionCard.vue'
import { AlphaColorMap } from '~/constants'
import { getBackgroundColorStyle, getTextColorStyle } from '~/utils'
import type { Promotion } from '~/types/promotion'
import { useI18n } from '#i18n'

const { movPromotions } = await useBasketPromotions()

const { t } = useI18n()

const getBackgroundColor = (promotion: Promotion) => {
  return getBackgroundColorStyle(
    promotion.customData.colorHex,
    AlphaColorMap.ALPHA_20,
  ).backgroundColor
}

const getAriaLabel = ({ customData, name }: Promotion) => {
  return customData?.category?.id
    ? t('basket.promotion.mov_banner_label', name)
    : undefined
}
</script>
