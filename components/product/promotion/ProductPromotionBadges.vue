<template>
  <div v-if="productPromotionId" class="flex flex-col">
    <template v-for="{ id, customData, priority } in orderedPromotions">
      <div
        v-if="customData.product?.badgeLabel"
        :key="id"
        class="z-10 mb-1 flex flex-nowrap items-center justify-center gap-[1ch] bg-blue px-2 py-[.375rem] text-center text-xs text-white last-of-type:mb-0"
        :class="{
          'last-of-type:rounded-b-md': isFullWidth,
          'rounded-md': !isFullWidth,
        }"
        :style="getBackgroundColorStyle(customData.colorHex)"
      >
        <span
          v-if="
            customData.headlineParts?.length && !customData.product?.badgeLabel
          "
          class="hidden truncate font-bold"
          :class="{
            'md:inline-block': !isBasket,
            'inline-block': !customData.product?.badgeLabel,
          }"
        >
          {{ getOfferText(customData) }}</span
        >
        <span
          v-if="customData.product?.badgeLabel"
          class="truncate font-medium"
        >
          {{ customData.product?.badgeLabel }}</span
        >
        <template v-if="isPriorityLabelShown && isHighestPriority(priority)">
          <IconForward class="mx-2 size-2" />
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
  isFullWidth?: boolean
}

const route = useRoute()
const localePath = useLocalePath()

const isBasket = computed(() => route.path === localePath(routeList.basket))

const props = withDefaults(defineProps<Props>(), {
  isPriorityLabelShown: false,
  isFullWidth: true,
})

function getOfferText(customData: Promotion['customData']) {
  return customData.headlineParts?.at(0) ?? ''
}

const { productPromotionId, applicablePromotions, isHighestPriority } =
  await useProductPromotions(props.product)

const orderedPromotions = computed(() => {
  return _sort(applicablePromotions.value, (it) => it.priority)
})
</script>
