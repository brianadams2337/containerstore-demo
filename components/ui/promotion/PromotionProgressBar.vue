<template>
  <div class="flex w-[19.5rem] items-center justify-center">
    <ProgressBar
      :progress="progress"
      rounded
      type="neutral"
      background-color="bg-white/20"
      class="mr-2 !max-w-[12.5rem]" />
    <span class="w-28 font-semibold">
      {{ $t('promotion.progress_left', { amount: formattedAmount }) }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  minOrderValue: {
    type: Number,
    required: true,
  },
})

const { data: basketData } = await useBasket()

const minOrderAmount = computed(() => divideWithHundred(props.minOrderValue))
const formattedAmount = computed(() => toCurrency(props.minOrderValue))

const progress = computed(() => {
  return Math.ceil(basketData.value.cost.withTax / minOrderAmount.value)
})
</script>
