import { getAttributeValues } from '@scayle/storefront-api'
import { computed } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import {
  getOrdinalSuffix,
  hasSubscriptionCustomData,
} from '../helpers/subscription'
import { useNuxtApp } from '#app'

/**
 * Computes subscription attributes for a basket item.
 *
 * @param basketItem - The basket item to extract subscription data from
 */
export default (basketItem: BasketItem) => {
  const { $i18n } = useNuxtApp()
  const customData = computed(
    () => (basketItem?.customData || {}) as Record<string, unknown>,
  )
  const hasSubscriptionData = computed(() =>
    hasSubscriptionCustomData(customData.value),
  )

  /**
   * Gets the label of a subscription value based on its attribute name and value.
   *
   * @param attributeName - The attribute name for which to get the label
   * @param attributeValue - The attribute value for which to get the label
   */
  const getSubscriptionValueLabel = (
    attributeName: string,
    attributeValue: string,
  ) =>
    getAttributeValues(basketItem.variant.attributes, attributeName).find(
      (value) => value.value === attributeValue,
    )?.label

  const subscriptionAttributes = computed(() => {
    const attributes = []

    const subscriptionDefinition =
      customData.value?.subscriptionDefinition &&
      typeof customData.value?.subscriptionDefinition === 'object' &&
      'subscriptionInterval' in customData.value.subscriptionDefinition
        ? (customData.value?.subscriptionDefinition
            ?.subscriptionInterval as string)
        : undefined

    if (subscriptionDefinition) {
      attributes.push({
        label: $i18n.t('subscription.interval'),
        value: getSubscriptionValueLabel(
          'subscriptionAvailableIntervals',
          subscriptionDefinition,
        ),
      })
    }

    const deliveryDay =
      customData.value?.subscriptionDefinition &&
      typeof customData.value?.subscriptionDefinition === 'object' &&
      'subscriptionDeliveryDate' in customData.value.subscriptionDefinition
        ? (customData.value?.subscriptionDefinition
            ?.subscriptionDeliveryDate as number)
        : undefined

    if (deliveryDay) {
      const ordinalSuffixKey = getOrdinalSuffix($i18n.locale, deliveryDay)
      attributes.push({
        label: $i18n.t('subscription.follow_up_delivery'),
        value: $i18n.t('subscription.day_of_month_selection_caption', {
          dayOfMonth:
            deliveryDay +
            $i18n.t(`global.ordinal_suffixes.${ordinalSuffixKey}`),
        }),
      })
    }

    return attributes
  })
  return {
    hasSubscriptionData,
    subscriptionAttributes,
  }
}
