<template>
  <p
    class="font-medium"
    :class="{ 'text-xs leading-4': isSmall || !isMOVPromotionApplied }"
  >
    <template v-if="isMOVPromotionApplied">
      🎉
      {{ $t('promotion.full_progress_message.first_part') }}
      <span class="font-bold">
        {{
          $t('promotion.full_progress_message.middle_part', {
            amount: formattedDiscount,
          })
        }}
      </span>
      {{ $t('promotion.full_progress_message.last_part') }}
    </template>
    <template v-else>
      {{ $t('promotion.cart_reached.first_part') }}
      <span class="font-bold">
        {{
          $t('promotion.cart_reached.middle_part', {
            discount: automaticDiscount,
          })
        }}
      </span>
      {{ $t('promotion.cart_reached.last_part') }}
    </template>
  </p>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ isSmall?: boolean }>(), { isSmall: false })

const { formattedDiscount, isMOVPromotionApplied } =
  await usePromotionProgress()

const { automaticDiscount } = useCurrentPromotion()
</script>
