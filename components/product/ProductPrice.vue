<template>
  <div>
    <slot name="relative-reductions" v-bind="{ showBadge, totalReductions }">
      <span
        v-if="showBadge && totalReductions"
        class="inline-block rounded-md bg-red-500 px-2 py-1 text-sm text-white"
      >
        -{{ totalReductions.relative * 100 }}%
      </span>
    </slot>
    <slot
      v-bind="{
        classes,
        showPriceFrom,
        totalReductions,
        isAutomaticDiscountPriceApplicable,
        isFree,
        formatCurrency,
        price,
        totalPrice,
      }"
    >
      <p class="leading-snug" :class="classes" data-test-id="price">
        <template v-if="showPriceFrom">
          {{ $t('price.starting_from') }}
        </template>
        {{ totalPrice }}
        <span
          v-if="
            totalReductions.absoluteWithTax ||
            isAutomaticDiscountPriceApplicable ||
            isFree
          "
          class="text-sm font-medium text-primary line-through"
          data-test-id="initialProductPrice"
        >
          {{ formatCurrency(price.withTax + totalReductions.absoluteWithTax) }}
        </span>
      </p>
    </slot>

    <slot name="tax-info">
      <div
        v-if="showTaxInfo"
        class="text-right text-xs text-gray-700 md:text-left"
      >
        {{ $t('price.including_vat') }}
      </div>
    </slot>
    <p
      v-if="appliedReductions.length && hasLowestPriorPrice && !isFree"
      class="mt-0.5 text-sm text-gray-700"
    >
      {{ $t('price.best_price_30d') }}
      {{ formatCurrency(lowestPriorPrice.withTax ?? 0) }}
      ({{ (lowestPriorPrice.relativeDifferenceToPrice ?? 0) * 100 }}%)
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  type Price,
  type LowestPriorPrice,
  type Product,
  getTotalAppliedReductions,
} from '@scayle/storefront-nuxt'
import { Size } from '#imports'

type Props = {
  product: Product
  price: Price
  lowestPriorPrice?: LowestPriorPrice
  showTaxInfo?: boolean
  showPriceFrom?: boolean
  showAutomaticDiscount?: boolean
  showPriceReductionBadge?: boolean
  isFree?: boolean
  size?: Size
  type?: 'normal' | 'whisper' | 'loud'
}

const props = withDefaults(defineProps<Props>(), {
  lowestPriorPrice: () => ({
    withTax: null,
    relativeDifferenceToPrice: null,
  }),
  showTaxInfo: false,
  showPriceFrom: false,
  showPriceReductionBadge: false,
  isFree: false,
  size: Size.XL,
  type: 'loud',
})

const { formatCurrency } = useFormatHelpers()
const appliedReductions = computed(() => props.price?.appliedReductions)

const { automaticDiscountPromotion, getAppliedAutomaticDiscountPrice } =
  await useProductPromotions(props.product)

const { data: basketData } = await useBasket()

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

const totalPrice = computed(() => {
  if (props.isFree) {
    return formatCurrency(0)
  }
  return isAutomaticDiscountPriceApplicable.value
    ? formatCurrency(getAppliedAutomaticDiscountPrice(props.price) as number)
    : formatCurrency(props.price.withTax)
})

const totalReductions = computed(() => getTotalAppliedReductions(props.price))

const showBadge = computed(() => {
  return appliedReductions.value && props.showPriceReductionBadge
})

const hasLowestPriorPrice = computed(() => {
  return (
    props.lowestPriorPrice?.withTax &&
    props.lowestPriorPrice?.relativeDifferenceToPrice
  )
})

const classes = computed(() => ({
  'mt-2': showBadge.value,
  'text-xl': props.size === Size.XL,
  'text-lg': props.size === Size.LG,
  'text-sm': props.size === Size.SM,
  'text-base': props.size === Size.MD,
  'text-xs': props.size === Size.XS,
  'font-bold': props.type === 'loud',
  'font-semibold': props.type === 'whisper',
  'text-red-500':
    appliedReductions.value.length ||
    isAutomaticDiscountPriceApplicable.value ||
    props.isFree,
}))
</script>
