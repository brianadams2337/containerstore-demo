<template>
  <h1 class="mr-1 flex flex-wrap items-center text-xs font-medium">
    {{ $t('promotion.automatic_discount_headline.add_label') }}
    <span v-if="progress > 0" class="ml-1">
      {{ $t('promotion.automatic_discount_headline.another_label') }}
    </span>
    <span class="mx-1 font-bold">{{ formattedAmountLeft }}</span>
    <span class="mr-1">
      {{ $t('promotion.automatic_discount_headline.save_indicator_label') }}
    </span>
    <span v-if="automaticDiscount" class="font-bold uppercase">
      {{
        $t('promotion.automatic_discount_headline.offer', {
          discount: automaticDiscount,
        })
      }}
    </span>
    <IconInfoOutline class="ml-1 h-4 w-4" />
  </h1>
</template>

<script setup lang="ts">
const { automaticDiscount } = useCurrentPromotion()

const { progress, formattedAmountLeft } = await usePromotionProgress()
</script>
