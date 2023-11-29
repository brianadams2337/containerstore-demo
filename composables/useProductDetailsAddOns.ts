import {
  type Product,
  flattenDeep,
  flattenFieldSet,
} from '@scayle/storefront-nuxt'

export default (productItem: MaybeRefOrGetter<Product>) => {
  const product = toRef(productItem)

  const selectedAddOns = useState<{ [id: number]: boolean }>(
    `selected-add-on-${product.value.id}`,
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
      const flattened = {
        ...flattenDeep(flattenFieldSet(value.fieldSet))[0],
        values: flattenDeep(
          value.groupSet.map((g) => flattenFieldSet(g.fieldSet)),
        ),
      }
      return (flattened as any).value
    })

    return flattenedValues.map((val) => parseInt(val))
  })
  const isAnyAddOnSelected = computed(() => {
    const anySelected = Object.keys(selectedAddOns.value).find(
      (key) => selectedAddOns.value[key as any],
    )
    return !!anySelected
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
    selectedAddOns,
  }
}
