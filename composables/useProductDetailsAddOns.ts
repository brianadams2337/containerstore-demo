import {
  type Product,
  flattenDeep,
  flattenFieldSet,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, toRef, computed, readonly, toValue } from 'vue'
import { useState } from '#app/composables/state'

export function useProductDetailsAddOns(
  productId: MaybeRefOrGetter<number>,
  productItem?: MaybeRefOrGetter<Product | undefined>,
) {
  const product = toRef(productItem)

  const selectedAddOns = useState<{ [id: number]: boolean }>(
    `selected-add-on-${toValue(productId)}`,
    () => ({}),
  )

  const addOnServiceAttribute = computed(() => {
    return product.value?.advancedAttributes
      ? product.value?.advancedAttributes.additionalService ?? null
      : null
  })

  const availableAddOns = computed<number[]>(() => {
    if (!addOnServiceAttribute.value) {
      return []
    }

    const flattenedValues = addOnServiceAttribute.value.values.map((value) => {
      return flattenDeep(flattenFieldSet(value.fieldSet))[0].value
    })

    return flattenedValues
      .filter((val) => val !== null && val !== undefined)
      .map((val) => (typeof val === 'number' ? val : parseInt(val)))
  })

  const isAnyAddOnSelected = computed(() => {
    const anySelected = Object.keys(selectedAddOns.value).find(
      (key) => selectedAddOns.value[parseInt(key)],
    )
    return !!anySelected
  })

  const selectedAddOnVariantIds = computed(() => {
    return Object.entries(selectedAddOns.value)
      .filter(([_, isSelected]) => isSelected)
      .map(([variantId]) => +variantId)
  })

  const onAddOnSelected = ({
    isSelected,
    variantId,
  }: {
    isSelected: boolean
    variantId: number
  }) => {
    selectedAddOns.value = {
      ...selectedAddOns.value,
      [variantId]: isSelected,
    }
  }

  return {
    addOnServiceAttribute,
    availableAddOns,
    isAnyAddOnSelected,
    onAddOnSelected,
    selectedAddOns: readonly(selectedAddOns),
    selectedAddOnVariantIds,
  }
}
