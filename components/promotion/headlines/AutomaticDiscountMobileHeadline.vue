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
    <span v-if="discount" class="font-bold uppercase">
      {{ $t('promotion.automatic_discount_headline.offer', { discount }) }}
    </span>
    <IconInfoOutline class="ml-1 h-4 w-4" />
  </h1>
</template>

<script setup lang="ts">
import { PromotionEffectType } from '@scayle/storefront-nuxt'

const props = defineProps<{ currentPromotion: Promotion }>()

const { progress, formattedAmountLeft } = await usePromotionProgress(
  props.currentPromotion,
)

const discount = computed(() => {
  const type = props.currentPromotion.effect.type
  if (type === PromotionEffectType.AUTOMATIC_DISCOUNT) {
    return props.currentPromotion.effect.additionalData.value
  }
})
</script>
