import {
  type Product,
  getAttributeValue,
  getAttributeValueTuples,
  getFirstAttributeValue,
  getFlattenedAdvancedAttribute,
} from '@scayle/storefront-nuxt'

export const getAdvancedAttributes = <T>({
  product,
  property,
}: {
  product: Product
  property: string
}): Array<T> => {
  const valueList = getFlattenedAdvancedAttribute<{ value: T }>(
    product?.advancedAttributes?.[property]?.values || [],
  )

  return valueList.filter((entry) => entry.value).map((item) => item.value)
}

export default {
  getAdvancedAttributes,
  getAttributeValue,
  getAttributeValueTuples,
  getFirstAttributeValue,
}
