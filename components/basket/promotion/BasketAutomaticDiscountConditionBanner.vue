<template>
  <PromotionCard
    v-if="promotion"
    :promotion="promotion"
    :background-color="backgroundColorStyle.backgroundColor"
    class="flex w-full flex-col rounded-md px-4 py-2 text-white"
  >
    <template #default="{ headlineParts, scheduledTo }">
      <div
        class="flex flex-wrap justify-between sm:flex-nowrap md:items-center lg:flex-nowrap"
      >
        <PromotionHeadline
          v-if="headlineParts"
          :headline-parts="headlineParts"
          size="sm"
          class="text-balance lg:basis-1/2 xl:basis-7/12"
        />
        <PromotionCountdown
          :until="scheduledTo"
          class="md:items-center md:justify-end lg:basis-1/2 xl:basis-5/12"
          borderless
        />
      </div>
      <ProductPromotionProgressLabel
        v-if="isMOVPromotionApplied && promotion"
        :promotion="promotion"
        class="mb-1"
      />
    </template>
  </PromotionCard>
</template>

<script setup lang="ts">
import { type BasketItem } from '@scayle/storefront-nuxt'

const props = defineProps<{ basketItem: BasketItem }>()

const { promotion, backgroundColorStyle } = await useBasketItemPromotion(
  toRef(props.basketItem),
)

const { isMOVPromotionApplied } = await usePromotionProgress(promotion)
</script>
