<template>
  <p class="font-medium" :class="{ 'text-xs leading-5': isSmall }">
    🎉
    {{ $t('promotion.full_progress_message.first_part') }}
    <span class="font-bold">
      {{
        $t('promotion.full_progress_message.middle_part', {
          amount: formattedAmount,
        })
      }}
    </span>
    {{ $t('promotion.full_progress_message.last_part') }}
  </p>
</template>

<script setup lang="ts">
type Props = {
  currentPromotion: Promotion
  isSmall?: boolean
}
const props = withDefaults(defineProps<Props>(), { isSmall: false })

const { formattedAmount } = await usePromotionProgress(props.currentPromotion)
</script>
