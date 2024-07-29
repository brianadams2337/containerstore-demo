<template>
  <div class="flex flex-wrap items-center gap-1">
    <slot
      v-bind="{
        classes,
        showPriceFrom,
        totalReductions,
        appliedReductions,
        isAutomaticDiscountPriceApplicable,
        isFree,
        formatCurrency,
        price,
        totalPrice,
        styles,
      }"
    >
      <slot
        name="relative-reductions"
        v-bind="{
          showBadge,
          appliedReductions,
          relativeReductions,
          totalReductions,
        }"
      >
        <template v-if="showBadge">
          <span
            v-for="relativeReduction in relativeReductions"
            :key="`${relativeReduction}-badge`"
            class="mr-1 inline-block rounded bg-red px-1 text-xs font-semibold text-white"
          >
            -{{ relativeReduction }}%
          </span>
        </template>
      </slot>
      <p class="text-gray-900" :class="classes" data-testid="price">
        <template v-if="showPriceFrom && formattedMinPrice">
          {{ $t('price.starting_from') }}
        </template>
        {{ formattedMinPrice || totalPrice }}
        <template
          v-if="
            formattedAppliedReductions.length ||
            isAutomaticDiscountPriceApplicable ||
            isFree
          "
        >
          <span
            v-for="(reduction, index) in formattedAppliedReductions"
            :key="`${reduction}-${index}`"
            class="mr-1 font-normal text-gray-600 line-through last-of-type:mr-0"
            data-testid="initialProductPrice"
          >
            {{ reduction }}
          </span>
        </template>
      </p>
    </slot>

    <slot name="tax-info">
      <div
        v-if="showTaxInfo"
        class="ml-1 text-right text-xs text-gray-700 md:text-left"
      >
        {{ $t('price.including_vat') }}
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  type Price,
  type Product,
  getTotalAppliedReductions,
} from '@scayle/storefront-nuxt'
import { getBackgroundColorStyle, getTextColorStyle } from '~/utils/promotion'
import { AlphaColorMap } from '~/constants/color'
import { useBasket, useFormatHelpers } from '#storefront/composables'
import { useProductPromotions } from '~/composables'
import { Size } from '#storefront-ui'
import tailwindConfig from '~/tailwind.config'

type Props = {
  product: Product
  price: Price
  showTaxInfo?: boolean
  showPriceFrom?: boolean
  showAutomaticDiscount?: boolean
  showPriceReductionBadge?: boolean
  isFree?: boolean
  size?: Size
  type?: 'normal' | 'whisper' | 'loud'
}

const props = withDefaults(defineProps<Props>(), {
  showTaxInfo: false,
  showPriceFrom: false,
  showPriceReductionBadge: false,
  isFree: false,
  size: Size.MD,
  type: 'normal',
})

const { formatCurrency } = useFormatHelpers()

const appliedReductions = computed(() => {
  const reductions = props.price?.appliedReductions ?? []
  return reductions.toReversed()
})

const formattedAppliedReductions = computed(() => {
  return appliedReductions.value
    .map(({ amount }) => amount.absoluteWithTax)
    .reduce<number[]>((reductions, reduction, index) => {
      const price = index === 0 ? props.price.withTax : reductions[index - 1]
      reductions.push(price + reduction)
      return reductions
    }, [])
    .map((reduction) => formatCurrency(reduction))
})

const relativeReductions = computed(() => {
  return appliedReductions.value.map(({ amount }) =>
    Math.round(amount.relative * 100),
  )
})

const { automaticDiscountPromotion, getAppliedAutomaticDiscountPrice } =
  useProductPromotions(props.product)

const { data: basketData } = useBasket()

const isAutomaticDiscountApplied = computed(() => {
  if (!automaticDiscountPromotion.value) {
    return false
  }

  return basketData.value?.items.some(({ promotion, promotionId, product }) => {
    return (
      props.product.id === product.id &&
      promotionId === automaticDiscountPromotion.value?.id &&
      promotion?.isValid
    )
  })
})

const isAutomaticDiscountPriceApplicable = computed(() => {
  return props.showAutomaticDiscount && isAutomaticDiscountApplied.value
})

// TODO: Re-visit this within PDP implementation if needed anymore
const totalReductions = computed(() => getTotalAppliedReductions(props.price))

const totalPrice = computed(() => {
  if (props.isFree) {
    return formatCurrency(0)
  }

  return isAutomaticDiscountPriceApplicable.value
    ? formatCurrency(getAppliedAutomaticDiscountPrice(props.price) as number)
    : formatCurrency(props.price.withTax)
})

const formattedMinPrice = computed<string | null>(() => {
  const minPrice = props.product.priceRange?.min.withTax
  const hasDifferentPrices = minPrice !== props.product.priceRange?.max.withTax
  return hasDifferentPrices && minPrice ? formatCurrency(minPrice) : null
})

const showBadge = computed(() => {
  return appliedReductions.value.length && props.showPriceReductionBadge
})

const classes = computed(() => ({
  'text-xl': props.size === Size.XL,
  'text-lg': props.size === Size.LG,
  'text-sm': props.size === Size.SM,
  'text-base': props.size === Size.MD,
  'text-xs': props.size === Size.XS,
  'font-bold': props.type === 'loud',
  'font-semibold': props.type === 'whisper',
  'font-variable': props.type === 'normal',
  'text-status-error':
    appliedReductions.value.length ||
    isAutomaticDiscountPriceApplicable.value ||
    props.isFree,
}))

const styles = computed(() => {
  if (isAutomaticDiscountApplied.value) {
    return {
      ...getBackgroundColorStyle(
        automaticDiscountPromotion.value?.customData?.colorHex,
        AlphaColorMap.ALPHA_10,
      ),
      ...getTextColorStyle(
        automaticDiscountPromotion.value?.customData?.colorHex,
        AlphaColorMap.ALPHA_100,
      ),
    }
  }

  const hasSale = appliedReductions.value.some(
    ({ category }) => category === 'sale',
  )

  if (hasSale) {
    return {
      ...getTextColorStyle(
        tailwindConfig.theme.extend.colors.red.DEFAULT,
        AlphaColorMap.ALPHA_100,
      ),
    }
  }

  return undefined
})
</script>
