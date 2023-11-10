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
withDefaults(defineProps<{ isSmall?: boolean }>(), { isSmall: false })

const { formattedAmount } = await usePromotionProgress()
</script>
