import {
  type Product,
  type Value,
  type Variant,
  getAttributeValue,
  getFirstAttributeValue,
  getPrice,
  getTotalAppliedReductions,
  extendPromise,
} from '@scayle/storefront-nuxt'

import type { Ref } from 'vue'
import {
  type PreferredDeliveryDate,
  SUBSCRIPTION_CANCELLATION_POLICY,
  SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME,
  SUBSCRIPTION_INTERVALS_ATTRIBUTE_NAME,
  SUBSCRIPTION_TERM,
  getOrdinalSuffix,
  getSubscriptionIntervals,
} from '../helpers/subscription'

const selectedInterval = ref<Value | undefined>()
const selectedPreferredDeliveryDate = ref<PreferredDeliveryDate | undefined>()

export function useSubscription(
  product: Ref<Product>,
  pricePromotionKey: Ref<string>,
  variant: Ref<Variant | undefined>,
  key?: string,
) {
  const { $i18n } = useNuxtApp()
  const productPromise = useProduct({
    params: {
      id: product.value.id,
      with: {
        variants: {
          attributes: {
            withKey: [
              SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME,
              SUBSCRIPTION_INTERVALS_ATTRIBUTE_NAME,
              SUBSCRIPTION_TERM,
              SUBSCRIPTION_CANCELLATION_POLICY,
            ],
          },
          lowestPriorPrice: true,
        },
      },
      pricePromotionKey: pricePromotionKey.value,
    },
    key: `product-subscription-${key}`,
  })

  const { data: subscriptionProduct } = productPromise

  const subscriptionIntervals = computed(() =>
    getSubscriptionIntervals(selectedVariant.value),
  )

  const subscriptionTerm = computed(() =>
    getFirstAttributeValue(
      selectedVariant.value?.attributes,
      SUBSCRIPTION_TERM,
    ),
  )

  const subscriptionCancellationPolicy = computed(() =>
    getFirstAttributeValue(
      selectedVariant.value?.attributes,
      SUBSCRIPTION_CANCELLATION_POLICY,
    ),
  )

  const itemToAdd = computed(() => {
    return {
      variantId: selectedVariant.value?.id,
      quantity: 1,
      customData: customData.value,
      displayData: displayData.value,
    }
  })

  const customData = computed(() => {
    return {
      subscriptionDefinition: {
        subscriptionInterval: selectedInterval.value?.value,
        subscriptionDeliveryDate: selectedPreferredDeliveryDate.value?.day,
        subscriptionTerm: subscriptionTerm.value?.value,
        subscriptionCancellationPolicy:
          subscriptionCancellationPolicy.value?.value,
      },
      pricePromotionKey: pricePromotionKey.value,
    }
  })

  const ordinalSuffixKey = computed(() =>
    getOrdinalSuffix($i18n.locale, selectedPreferredDeliveryDate.value?.day),
  )

  const displayData = computed(() => {
    const intervalValue = `${$i18n.t(
      'subscription.interval',
    )}: ${selectedInterval.value?.label}`

    const deliveryValue = `${$i18n.t(
      'subscription.follow_up_delivery',
    )}: ${$i18n.t('subscription.day_of_month_selection_caption', {
      dayOfMonth:
        selectedPreferredDeliveryDate.value?.day +
        $i18n.t(`global.ordinal_suffixes.${ordinalSuffixKey.value}`),
    })}`

    const term = `${$i18n.t('subscription.term')}: ${subscriptionTerm.value
      ?.label}`

    return {
      'attribute-1': {
        key: 'subscriptionDefinition',
        label: $i18n.t('subscription.title'),
        value: `${intervalValue} | ${deliveryValue} | ${term}`,
      },
    }
  })

  const subscriptionPrice = computed(() =>
    selectedVariant.value ? getPrice(selectedVariant.value) : undefined,
  )

  const subscriptionVariantEligible = computed(
    () =>
      getAttributeValue(
        selectedVariant.value?.attributes,
        SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME,
      ) === 'true',
  )

  const totalReductions = computed(
    () =>
      (subscriptionPrice.value &&
        getTotalAppliedReductions(subscriptionPrice.value)?.relative * 100) ||
      0,
  )

  const selectedVariant = computed(() => {
    return subscriptionProduct.value?.variants?.find(
      (subscriptionVariant) => subscriptionVariant.id === variant.value?.id,
    )
  })

  return extendPromise(
    productPromise.then(() => ({})),
    {
      subscriptionProduct,
      selectedVariant,
      subscriptionIntervals,
      selectedInterval,
      selectedPreferredDeliveryDate,
      itemToAdd,
      subscriptionPrice,
      subscriptionVariantEligible,
      totalReductions,
      ordinalSuffixKey,
    },
  )
}
