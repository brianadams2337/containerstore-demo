<template>
  <div class="flex flex-col">
    <div
      v-for="{
        id,
        customData,
        schedule,
        productId,
      } in automaticDiscountPromotions"
      v-show="shouldShowAutomaticDiscountBanner(productId)"
      :key="`automatic-discount-banner-${id}`"
      class="mb-1 flex h-fit flex-wrap items-center justify-between gap-y-[.125rem] rounded-md bg-blue px-4 py-3 text-xs font-semibold text-white"
      :style="getBackgroundColorStyle(customData.colorHex)"
    >
      <SFHeadline
        tag="h2"
        size="xs"
        is-bold
        class="text-balance lg:basis-5/12 xl:basis-7/12"
      >
        {{ $t('promotion.hurry_to_save') }}
        {{ customData.product?.badgeLabel }}
      </SFHeadline>
      <PromotionCountdown
        :until="schedule.to"
        class="min-w-fit max-w-fit lg:basis-7/12 lg:justify-end xl:basis-5/12"
      />
    </div>
    <div
      v-for="{ id, customData, schedule } in buyXGetYPromotions"
      v-show="shouldShowBuyXGetYBanner(customData?.product?.promotionId)"
      :key="`buy-x-get-y-banner-${id}`"
      class="mb-2 flex h-fit items-center justify-between rounded-md bg-blue px-4 py-3 text-xs font-semibold text-white last-of-type:mb-0"
      :style="getBackgroundColorStyle(customData.colorHex)"
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
        :until="schedule.to"
        borderless
        class="lg:basis-7/12 lg:justify-end xl:basis-5/12"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = withDefaults(defineProps<{ product?: Product }>(), {
  product: undefined,
})

const route = useRoute()
const localePath = useLocalePath()

const { buyXGetYPromotions, automaticDiscountPromotions } =
  await useBasketPromotions()

const { productPromotionId } = await useProductPromotions(props.product)

const isBasketPage = computed(() => {
  return route.path === localePath(routeList.basket)
})

const shouldShowAutomaticDiscountBanner = (productId: number) => {
  return isBasketPage.value || productId === props.product?.id
}

const shouldShowBuyXGetYBanner = (promotionId?: number) => {
  return isBasketPage.value || promotionId === productPromotionId.value
}
</script>
