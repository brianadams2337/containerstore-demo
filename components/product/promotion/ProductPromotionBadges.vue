<template>
  <div
    v-if="productPromotionId"
    class="flex flex-col"
    :class="{
      'w-full': !isBasket,
    }"
  >
    <template
      v-for="{ id, customData, priority } in orderedPromotions"
      :key="id"
    >
      <div
        class="z-10 mb-1 flex flex-wrap items-center justify-center gap-[1ch] bg-blue px-2 py-[.375rem] text-center text-xs text-white last-of-type:mb-0"
        :class="{
          'last-of-type:rounded-b-md': isFullWidth,
          'rounded-md': !isFullWidth,
        }"
        :style="getBackgroundColorStyle(customData.colorHex)"
      >
        <span
          v-if="getHeadlinePartsText(customData)"
          class="truncate font-bold"
        >
          {{ getHeadlinePartsText(customData) }}</span
        >
        <span
          v-if="(isPLP || isWishlist) && getBasketLabel(customData)"
          class="hidden truncate font-medium"
          :class="{
            'md:inline-block': !isBasket,
            '!inline-block': !getHeadlinePartsText(customData),
          }"
        >
          {{ getBasketLabel(customData) }}</span
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
import { computed } from 'vue'
import { sort } from 'radash'
import type { Product } from '@scayle/storefront-nuxt'
import { useProductPromotions } from '~/composables'
import { routeList } from '~/utils/route'
import { useLocalePath } from '#i18n'
import { useRoute } from '#app/composables/router'
import { getBackgroundColorStyle } from '~/utils/promotion'

type Props = {
  product: Product
  isPriorityLabelShown?: boolean
  isFullWidth?: boolean
}

const route = useRoute()
const localePath = useLocalePath()

const isBasket = computed(() => route.path === localePath(routeList.basket))
const isWishlist = computed(() => route.path === localePath(routeList.wishlist))
const isPLP = computed(
  () => route.meta.pageType === routeList.plp.meta?.pageType,
)

const props = withDefaults(defineProps<Props>(), {
  isPriorityLabelShown: false,
  isFullWidth: true,
})

function getHeadlinePartsText(customData: Promotion['customData']) {
  return (customData.headlineParts ?? []).at(0) ?? ''
}
function getBasketLabel(customData: Promotion['customData']) {
  return customData.product?.badgeLabel ?? ''
}

const { productPromotionId, applicablePromotions, isHighestPriority } =
  useProductPromotions(props.product)

const orderedPromotions = computed(() => {
  return sort(applicablePromotions.value, (it) => it.priority)
})
</script>
