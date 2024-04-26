<template>
  <div
    v-if="hasItemsWithPromotionReductions"
    class="flex flex-col justify-between gap-[.625rem]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-between">
        <AppButton
          type="raw"
          class="flex items-center justify-between whitespace-pre-line !p-0 text-start text-sm font-semibold leading-5 text-gray-800"
          is-full-width
          size="xs"
          @click="toggleDiscountsSummary"
        >
          <span class="text-sm leading-5">{{ $t('basket.discount') }}</span>
          <template #append-icon="{ _class }">
            <IconChevronUp v-if="showDiscountSummary" :class="_class" />
            <IconChevronDown v-else :class="_class" />
          </template>
        </AppButton>
      </div>

      <span
        v-if="totalPromotionsReductions"
        class="text-sm font-semibold leading-5 text-primary"
      >
        {{ withNegativePrefix(formatCurrency(totalPromotionsReductions)) }}
      </span>
    </div>
    <FadeInFromBottomTransition>
      <div v-if="showDiscountSummary" class="flex flex-col gap-2">
        <template
          v-for="promotionItem in itemsWithPromotionsReductions"
          :key="promotionItem.promotion?.id"
        >
          <div
            class="flex items-center justify-between rounded"
            :class="[
              'px-2',
              'py-[.375rem]',
              {
                'text-sm font-semibold leading-[17px]': true,
              },
            ]"
            :style="{
              ...getBackgroundColorStyle(
                promotionItem.promotion?.customData.colorHex,
                10,
              ),
              ...getTextColorStyle(
                promotionItem.promotion?.customData.colorHex,
                100,
              ),
            }"
          >
            <span
              v-if="promotionItem.promotion?.customData"
              class="text-xs leading-5"
            >
              {{ getHeadlineParts(promotionItem?.promotion) }}</span
            >
            <span class="text-xs font-medium leading-5 text-primary">{{
              withNegativePrefix(formatCurrency(promotionItem.total))
            }}</span>
          </div>
        </template>
      </div>
    </FadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
import { useBasketReductions } from '~/composables/useBasketReductions'

const {
  hasItemsWithPromotionReductions,
  itemsWithPromotionsReductions,
  totalPromotionsReductions,
  getHeadlineParts,
  withNegativePrefix,
} = await useBasketReductions()

const showDiscountSummary = ref(true)
const { formatCurrency } = useFormatHelpers()

function toggleDiscountsSummary() {
  showDiscountSummary.value = !showDiscountSummary.value
}
</script>
