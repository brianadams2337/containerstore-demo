<template>
  <div v-if="productPromotionId" class="flex h-fit flex-col">
    <template v-for="{ id, customData, priority } in applicablePromotions">
      <div
        v-if="customData.product?.badgeLabel"
        :key="id"
        class="mb-1 flex h-fit w-fit items-center rounded-md bg-blue p-1 px-2 text-xs font-semibold text-white last-of-type:mb-0"
        :style="getBackgroundColorStyle(customData.colorHex)"
      >
        {{ customData.product?.badgeLabel }}
        <template v-if="isPriorityLabelShown && isHighestPriority(priority)">
          <IconForward class="mx-2 h-2 w-2" />
          <span class="text-2xs font-semibold uppercase">
            {{ $t('promotion.highest_priority') }}
          </span>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

type Props = {
  product: Product
  isPriorityLabelShown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPriorityLabelShown: false,
})

const {
  productPromotionId,
  applicablePromotions,
  highestPriorityPromotion,
  hasMultipleApplicablePromotions,
} = await useProductPromotions(props.product)

const isHighestPriority = (priority: number) => {
  return (
    hasMultipleApplicablePromotions.value &&
    highestPriorityPromotion.value?.priority === priority
  )
}
</script>
