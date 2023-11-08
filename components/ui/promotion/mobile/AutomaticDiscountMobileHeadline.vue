<template>
  <div class="flex items-center text-white">
    <h1 class="mr-1 flex flex-wrap items-center text-xs font-medium">
      {{ $t('promotion.automatic_discount_headline.add_label') }}
      <span v-if="progress > 0" class="ml-1">
        {{ $t('promotion.automatic_discount_headline.another_label') }}
      </span>
      <span class="mx-1 font-bold">{{ formattedAmountLeft }}</span>
      {{ $t('promotion.automatic_discount_headline.save_indicator_label') }}
      <span v-if="discount" class="mx-1 font-bold uppercase">
        {{ $t('promotion.automatic_discount_headline.offer', { discount }) }}
      </span>
    </h1>
    <IconInfoOutline class="h-4 w-4" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ currentPromotion: Promotion }>()

const { progress, formattedAmountLeft } = await usePromotionProgress(
  props.currentPromotion,
)

const discount = computed(() => {
  const type = props.currentPromotion.effect.type
  if (type === 'automatic_discount') {
    return props.currentPromotion.effect.additionalData.value
  }
})
</script>
