import { sum } from 'radash'
import type { BasketItem } from '@scayle/storefront-nuxt'
import { hexToRGBAColor } from '~/utils/color'

export async function useBasketReductions() {
  const basket = await useBasket()

  const withNegativePrefix = (value: string): string => {
    return value.startsWith('-') ? value : `-${value}`
  }

  const getPromotionTextColor = (color: unknown): string | undefined => {
    if (typeof color !== 'string') return
    const fallbackColor = '#007aff'
    return hexToRGBAColor(color ?? fallbackColor, 100)
  }

  const getHeadlineParts = (promotion: Promotion): string => {
    return promotion.customData.headlineParts?.at(0) ?? ''
  }

  const hasSaleReduction = (item?: BasketItem): boolean => {
    if (!item) return false
    return item.price.total.appliedReductions.some(
      ({ category }) => category === 'sale',
    )
  }

  const hasPromotionReduction = (item?: BasketItem): boolean => {
    if (!item) return false
    return item.price.total.appliedReductions.some(
      ({ category }) => category === 'promotion',
    )
  }

  const getBasketItemSalePrice = (item: BasketItem): number => {
    return item.price.total.appliedReductions
      .filter((item) => item.category === 'sale')
      .reduce((price, current) => price + current.amount.absoluteWithTax, 0)
  }

  const totalDiscount = computed<number>(() => {
    const discounts = (basket.data.value?.cost.appliedReductions ?? []).map(
      ({ amount }) => amount.absoluteWithTax,
    )
    return sum(discounts)
  })

  const totalCost = computed<number | undefined>(() => {
    return basket.data.value?.cost.withTax
  })

  const totalCostWithoutReductions = computed<number>(() => {
    const totalCostValue = totalCost.value?.valueOf() ?? 0
    return sum([totalCostValue, totalDiscount.value])
  })

  const aggregatedSalePrice = computed<number>(() => {
    const basketItemsWithSaleReductions = (basket.items.value ?? []).filter(
      hasSaleReduction,
    )
    const allSaleReductions = basketItemsWithSaleReductions.reduce<number[]>(
      (previous, next) => {
        const price = getBasketItemSalePrice(next)
        previous.push(price)
        return previous
      },
      [],
    )
    return sum(allSaleReductions)
  })

  const itemsWithPromotionsReductions = computed(() => {
    return (basket.items.value ?? [])
      .filter(hasPromotionReduction)
      .reduce<{ promotion: BasketItem['promotion']; total: number }[]>(
        (previous, next) => {
          const existingPromotion = previous.find(
            ({ promotion }) => promotion?.id === next.promotion?.id,
          )
          const price = next.price.total.appliedReductions
            .filter((item) => item.category === 'promotion')
            .reduce((accumulator, current) => {
              return accumulator + current.amount.absoluteWithTax
            }, 0)

          if (existingPromotion) {
            existingPromotion.total += price
            return previous
          }

          previous.push({ promotion: next.promotion, total: price })
          return previous
        },
        [],
      )
  })

  const hasItemsWithSaleReductions = computed<boolean>(() => {
    return aggregatedSalePrice.value !== 0
  })

  const hasItemsWithPromotionReductions = computed<boolean>(() => {
    return itemsWithPromotionsReductions.value.length > 0
  })

  const totalSalesReductions = computed<number>(() => {
    const discounts = (basket.cost.value?.appliedReductions ?? [])
      .filter((item) => item.category === 'sale')
      .map(({ amount }) => amount.absoluteWithTax)

    return sum(discounts)
  })

  const totalPromotionsReductions = computed(() => {
    const discounts = (basket.data.value?.cost.appliedReductions ?? [])
      .filter((item) => item.category === 'promotion')
      .map(({ amount }) => amount.absoluteWithTax)
    return sum(discounts)
  })

  return {
    totalCost,
    totalDiscount,
    hasItemsWithSaleReductions,
    hasItemsWithPromotionReductions,
    aggregatedSalePrice,
    itemsWithPromotionsReductions,
    totalCostWithoutReductions,
    totalSalesReductions,
    totalPromotionsReductions,
    getHeadlineParts,
    getBasketItemSalePrice,
    withNegativePrefix,
    hasSaleReduction,
    hasPromotionReduction,
    getPromotionTextColor,
  }
}
