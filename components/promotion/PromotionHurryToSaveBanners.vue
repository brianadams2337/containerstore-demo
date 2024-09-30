<template>
  <div
    v-if="
      isAutomaticDiscountType(promotion) &&
      shouldShowAutomaticDiscountBanner(promotion.productId)
    "
    class="mb-1 flex h-fit flex-wrap items-center justify-between gap-y-[.125rem] rounded-md bg-blue px-4 py-3 text-xs font-semibold text-white"
    :style="getBackgroundColorStyle(promotion.customData.colorHex)"
  >
    <SFHeadline
      tag="h2"
      size="xs"
      is-bold
      class="text-balance lg:basis-5/12 xl:basis-7/12"
    >
      {{ $t('promotion.hurry_to_save') }}
      {{ promotion.customData.product?.badgeLabel }}
    </SFHeadline>
    <PromotionCountdown
      :time-until="promotion.schedule.to"
      class="min-w-fit max-w-fit lg:basis-7/12 lg:justify-end xl:basis-5/12"
    />
  </div>
  <div
    v-else-if="
      isBuyXGetYType(promotion) &&
      shouldShowBuyXGetYBanner(promotion.customData?.product?.promotionId)
    "
    class="mb-2 flex h-fit items-center justify-between rounded-md bg-blue px-4 py-3 text-xs font-semibold text-white last-of-type:mb-0"
    :style="getBackgroundColorStyle(promotion.customData.colorHex)"
  >
    <SFHeadline
      tag="h2"
      size="xs"
      is-bold
      class="text-balance lg:basis-5/12 xl:basis-7/12"
    >
      {{ $t('promotion.save_your_free_gift') }}
    </SFHeadline>
    <PromotionCountdown
      :time-until="promotion.schedule.to"
      borderless
      class="lg:basis-7/12 lg:justify-end xl:basis-5/12"
    />
  </div>
  <div v-else>
    {{ $t('promotion.not_available') }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PromotionCountdown from './PromotionCountdown.vue'
import { routeList } from '~/utils/route'
import { useLocalePath } from '#i18n'
import { useRoute } from '#app/composables/router'
import {
  getBackgroundColorStyle,
  isAutomaticDiscountType,
  isBuyXGetYType,
} from '~/utils/promotion'
import { SFHeadline } from '#storefront-ui/components'

type Props = {
  promotedProductId?: number
  promotionId?: number
  promotion: Promotion & { productId: number }
}
const props = defineProps<Props>()

const route = useRoute()
const localePath = useLocalePath()

const isBasketPage = computed(() => {
  return route.path === localePath(routeList.basket)
})

const shouldShowAutomaticDiscountBanner = (productId: number) => {
  return isBasketPage.value || productId === props.promotedProductId
}

const shouldShowBuyXGetYBanner = (promotionId?: number) => {
  return isBasketPage.value || promotionId === props.promotionId
}
</script>
