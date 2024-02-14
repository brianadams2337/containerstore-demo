<template>
  <p
    class="font-medium"
    :class="{ 'text-xs leading-4': isSmall || !isMOVPromotionApplied }"
  >
    <template v-if="isMOVPromotionApplied">
      🎉
      {{ $t('promotion.full_progress_message', { amount: formattedDiscount }) }}
    </template>
    <template v-else>
      {{ $t('promotion.cart_reached', { discount: automaticDiscount }) }}
    </template>
  </p>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ isSmall?: boolean }>(), { isSmall: false })

const { formattedDiscount, isMOVPromotionApplied } =
  await usePromotionProgress()

const { automaticDiscount } = useCurrentPromotion()
</script>
