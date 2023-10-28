<template>
  <div
    class="flex items-center justify-center"
    :class="isFullWidth ? 'w-full' : 'w-[19.5rem]'">
    <template v-if="!isFullProgress">
      <ProgressBar
        :progress="progress"
        rounded
        slanted
        type="neutral"
        :full-width="isFullWidth"
        :class="!isFullWidth && '!max-w-[12.5rem]'"
        background-color="bg-white/20" />
      <span v-if="isGreaterOrEquals('md')" class="ml-2 w-28 font-semibold">
        {{ $t('promotion.progress_left', { amount: formattedAmount }) }}
      </span>
    </template>
    <p v-else class="font-medium">
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  minOrderValue: {
    type: Number,
    required: true,
  },
  isFullWidth: {
    type: Boolean,
    default: false,
  },
})

const { isGreaterOrEquals } = useViewport()

const { data: basketData } = await useBasket()

const minOrderAmount = computed(() => divideWithHundred(props.minOrderValue))
const formattedAmount = computed(() => toCurrency(props.minOrderValue))

const progress = computed(() => {
  return Math.ceil(basketData.value.cost.withTax / minOrderAmount.value)
})

const isFullProgress = computed(() => progress.value >= 100)
</script>
