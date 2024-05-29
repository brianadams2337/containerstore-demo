import { extendPromise } from '@scayle/storefront-nuxt'
import { sum } from 'radash'

export function usePromotionProgress(
  promotion:
    | ComputedRef<Promotion | null>
    | Ref<Promotion | null>
    | ComputedRef<BasketPromotion | undefined>,
) {
  const { formatCurrency } = useFormatHelpers()

  const basket = useBasket()
  const { data: basketData } = basket

  const minOrderValue = computed<number>(() => {
    return promotion.value?.customData?.minOrderValue || 0
  })

  const minOrderAmount = computed<number>(() => {
    return divideByHundred(minOrderValue.value)
  })

  const basketTotal = computed<number>(() => {
    return getBasketTotalWithoutPromotions(basketData.value ?? undefined)
  })

  const progress = computed<number>(() => {
    if (!minOrderValue.value) {
      return 0
    }

    return basketTotal.value / minOrderAmount.value
  })

  const isFullProgress = computed<boolean>(() => {
    return !!progress.value && progress.value >= 100
  })

  const formattedAmountLeft = computed<string | undefined>(() => {
    if (!minOrderValue.value) {
      return
    }
    return formatCurrency(minOrderValue.value - basketTotal.value)
  })

  const discount = computed<number | undefined>(() => {
    const promotedItems = (basketData.value?.items ?? []).filter(
      (item) => item.promotionId === promotion.value?.id,
    )

    const reductions = promotedItems?.reduce<number[]>((previous, current) => {
      const reduction = current.price.total.appliedReductions.find(
        ({ category }) => category === 'promotion',
      )
      if (reduction) {
        previous.push(reduction.amount.absoluteWithTax)
      }
      return previous
    }, [])

    if (!reductions) return

    return sum(reductions)
  })

  const formattedDiscount = computed<string | undefined>(() => {
    if (!discount.value) return
    return formatCurrency(discount.value)
  })

  const isMOVPromotionApplied = computed<boolean>(() => {
    if (!minOrderValue.value) {
      return false
    }
    return (basketData.value?.items ?? []).some(({ promotionId }) => {
      return promotionId === promotion.value?.id
    })
  })

  return extendPromise(
    basket.then(() => ({})),
    {
      minOrderAmount,
      progress,
      isFullProgress,
      formattedAmountLeft,
      formattedDiscount,
      discount,
      isMOVPromotionApplied,
    },
  )
}
