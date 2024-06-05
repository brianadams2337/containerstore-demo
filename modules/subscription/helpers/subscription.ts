import {
  type BasketItem,
  type Product,
  type Variant,
  getAttributeValue,
  getAttributeValueTuples,
} from '@scayle/storefront-nuxt'

export const SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME = 'subscriptionEligibility'
export const SUBSCRIPTION_INTERVALS_ATTRIBUTE_NAME =
  'subscriptionAvailableIntervals'
export const SUBSCRIPTION_TERM = 'subscriptionTerm'
export const SUBSCRIPTION_CANCELLATION_POLICY = 'subscriptionCancellationPolicy'

export type PreferredDeliveryDate = {
  day: number
  label: string
}

// check if at least one variant of the product is eligible for subscription
export const isProductSubscriptionEligible = (product?: Product) =>
  !!product?.variants?.length &&
  product.variants.some((variant) => {
    return (
      getAttributeValue(
        variant.attributes,
        SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME,
      ) === 'true'
    )
  })

// check if the current variant fulfils the subscriptionEligibility condition and return all available intervals if so
export const getSubscriptionIntervals = (variant?: Variant) => {
  if (!variant) {
    return []
  }

  const attributeValue = getAttributeValue(
    variant.attributes,
    SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME,
  )

  if (attributeValue !== 'true') {
    return []
  }

  return getAttributeValueTuples(
    variant.attributes,
    SUBSCRIPTION_INTERVALS_ATTRIBUTE_NAME,
  )
}

export const getOrdinalSuffix = (locale: string, value?: number) => {
  if (!value) {
    return
  }
  const ordinalRules = new Intl.PluralRules(locale, { type: 'ordinal' })

  return ordinalRules.select(value)
}

// This check is for rejecting adding variant in case of:
// 1) try to add subscription variant (priorItemToAdd) but the variant (subscription or not doesn't matter) is already in the basket
// 2) try to add non-subscription variant but the variant is already in the basket, and it's a subscription variant
export const isSubscriptionAlreadyInBasket = (
  isSubscriptionVariant: boolean,
  variantId: number,
  basketItems?: BasketItem[],
) => {
  const variantAlreadyInBasket = basketItems?.find(
    (basketItem) => basketItem.variant.id === variantId,
  )

  const hasVariantInBasketSubscriptionDefined = Object.hasOwnProperty.call(
    variantAlreadyInBasket?.customData || {},
    'subscriptionDefinition',
  )

  return (
    (isSubscriptionVariant && variantAlreadyInBasket) ||
    (!isSubscriptionVariant &&
      variantAlreadyInBasket &&
      hasVariantInBasketSubscriptionDefined)
  )
}
