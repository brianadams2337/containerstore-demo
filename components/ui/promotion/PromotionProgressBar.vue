<template>
  <div class="flex w-80 items-center justify-center">
    <ProgressBar
      :progress="progress"
      rounded
      type="neutral"
      background-color="bg-white/20" />
    <span class="ml-3 w-32 font-semibold">
      {{
        $t('promotion.progress_left', {
          amount: toCurrency(minOrderValue),
        })
      }}
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

const progress = computed(() => {
  return Math.ceil(basketData.value.cost.withTax / minOrderAmount.value)
})
</script>
