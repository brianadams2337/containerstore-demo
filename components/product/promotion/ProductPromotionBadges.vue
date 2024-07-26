<template>
  <div
    v-if="productPromotionId"
    class="flex flex-col"
    :class="{ 'w-full': !isBasket }"
  >
    <div
      v-for="{ id, customData, priority } in orderedPromotions"
      :key="id"
      class="z-10 mb-1 flex flex-wrap items-center justify-center gap-[0.5ch] bg-blue px-2 py-1.5 text-center text-2xs uppercase text-white last-of-type:mb-0"
      :class="isFullWidth ? 'last-of-type:rounded-b-none' : 'rounded-md'"
      :style="getBackgroundColorStyle(customData.colorHex)"
    >
      <span
        v-if="getHeadlinePartsText(customData)"
        class="truncate font-variable"
      >
        {{ getHeadlinePartsText(customData) }}
      </span>
      <span
        v-if="isBadgeLabelShown(customData)"
        class="font-medium max-sm:hidden"
      >
        |
      </span>
      <span
        v-if="isBadgeLabelShown(customData)"
        class="hidden truncate font-bold"
        :class="{
          'md:inline-block': !isBasket,
          '!inline-block': !getHeadlinePartsText(customData),
        }"
      >
        {{ getBadgeLabel(customData) }}
      </span>
      <template v-if="isPriorityLabelShown && isHighestPriority(priority)">
        <IconForward class="mx-2 size-2" />
        <span class="text-2xs font-semibold uppercase">
          {{ $t('promotion.highest_priority') }}
        </span>
      </template>
    </div>
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

const props = withDefaults(defineProps<Props>(), {
  isPriorityLabelShown: false,
  isFullWidth: true,
})

const route = useRoute()
const localePath = useLocalePath()

const { productPromotionId, applicablePromotions, isHighestPriority } =
  useProductPromotions(props.product)

const isBasket = computed(() => route.path === localePath(routeList.basket))
const isWishlist = computed(() => route.path === localePath(routeList.wishlist))
const isPLP = computed(() => 'categories' in route.params)

const isBadgeLabelShown = (customData: Promotion['customData']) => {
  return (isPLP.value || isWishlist.value) && getBadgeLabel(customData)
}

const getHeadlinePartsText = (customData: Promotion['customData']) => {
  return (customData.headlineParts ?? []).at(0) ?? ''
}

const getBadgeLabel = (customData: Promotion['customData']) => {
  return customData.product?.badgeLabel ?? ''
}

const orderedPromotions = computed(() => {
  return sort(applicablePromotions.value, (it) => it.priority)
})
</script>
