<template>
  <div class="mb-3 flex items-end self-end">
    <section class="justify-ends flex flex-col items-end">
      <template v-if="reducedPrice">
        <div
          class="flex"
          :class="{
            'flex-col justify-end':
              hasSaleReduction(item) && !hasPromotionReduction(item),
            'mb-[.125rem] flex-row items-center':
              hasSaleReduction(item) && hasPromotionReduction(item),
          }"
        >
          <SFHeadline
            tag="p"
            size="base"
            class="p-1 text-xs leading-[1.125rem] text-secondary line-through"
          >
            {{ formatCurrency(price + reducedPrice) }}
          </SFHeadline>
          <SFHeadline
            v-if="hasSaleReduction(item)"
            tag="p"
            size="base"
            is-uppercase
            class="text-red"
            :class="{
              'p-1 text-xs leading-[1.125rem] text-secondary line-through':
                hasPromotionReduction(item),
            }"
          >
            {{ formatCurrency(getItemSaleReductionPrice(item)) }}
          </SFHeadline>
        </div>

        <SFHeadline
          v-if="hasPromotionReduction(item)"
          tag="p"
          size="base"
          is-uppercase
          class="mb-[.125rem] inline rounded p-1 text-base leading-5"
          :style="{
            ...getBackgroundColorStyle(
              item.promotion?.customData.colorHex,
              AlphaColorMap.ALPHA_10,
            ),
            ...getTextColorStyle(
              item?.promotion?.customData.colorHex,
              AlphaColorMap.ALPHA_100,
            ),
          }"
        >
          {{ formatCurrency(price) }}
        </SFHeadline>
      </template>
      <SFHeadline v-else tag="p" size="base" is-uppercase>
        {{ formatCurrency(price) }}
      </SFHeadline>
      <p class="text-xs text-secondary">
        {{ $t('incl_tax') }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { type BasketItem } from '@scayle/storefront-nuxt'
import { useBasketReductions } from '~/composables/useBasketReductions'

const props = defineProps<{ item: BasketItem }>()

const { formatCurrency } = useFormatHelpers()
const basketItem = computed(() => props.item)
const { price, reducedPrice } = await useBasketItem(basketItem)

function getItemSaleReductionPrice(item?: BasketItem) {
  if (!item) return 0
  const itemTotalSalePrice = getBasketItemSalePrice(item)
  const totalWithReduction = price.value + (reducedPrice.value ?? 0)
  return _sum([totalWithReduction, -itemTotalSalePrice])
}

const { hasSaleReduction, hasPromotionReduction, getBasketItemSalePrice } =
  await useBasketReductions()
</script>
