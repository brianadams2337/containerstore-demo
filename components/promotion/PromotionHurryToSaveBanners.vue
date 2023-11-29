<template>
  <div class="flex flex-col">
    <div
      v-for="{ id, customData, schedule } in automaticDiscountPromotions"
      :key="`automatic-discount-banner-${id}`"
      class="mb-2 flex h-fit items-center justify-between rounded-md bg-blue px-2 py-1 text-xs font-semibold text-white"
      :style="getBackgroundColorStyle(customData.colorHex)"
    >
      <Headline tag="h2" size="xs" is-bold is-uppercase>
        {{ $t('promotion.hurry_to_save') }}
        {{ customData.product?.badgeLabel }}
      </Headline>
      <PromotionCountdown :until="schedule.to" borderless />
    </div>
    <div
      v-for="{ id, customData, schedule } in buyXGetYPromotions"
      :key="`buy-x-get-y-banner-${id}`"
      class="mb-2 flex h-fit items-center justify-between rounded-md bg-blue px-2 py-1 text-xs font-semibold text-white last-of-type:mb-0"
      :style="getBackgroundColorStyle(customData.colorHex)"
    >
      <Headline tag="h2" size="xs" is-bold is-uppercase>
        {{ $t('promotion.save_your_free_gift') }}
      </Headline>
      <PromotionCountdown :until="schedule.to" borderless />
    </div>
  </div>
</template>

<script setup lang="ts">
const { buyXGetYPromotions, automaticDiscountPromotions } =
  await useBasketPromotions()
</script>
