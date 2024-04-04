<template>
  <div class="flex flex-col items-center p-4">
    <div>{{ $t('subscription.or') }}</div>
    <div class="text-sm font-bold">
      {{
        isVariantWithPriceReduction
          ? $t('subscription.subscribe_with_reduction', {
              percentage: totalReductions,
            })
          : $t('subscription.subscribe')
      }}
    </div>
  </div>
</template>
<script setup lang="ts">
type Props = {
  isVariantWithPriceReduction: boolean
  totalReductions?: number
}

withDefaults(defineProps<Props>(), {
  totalReductions: undefined,
})
</script>
