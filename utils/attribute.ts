import {
  getAttributeValue,
  getAttributeValueTuples,
  getFirstAttributeValue,
  type Product,
  getFlattenedVariantCrosssellings,
} from '@scayle/storefront-nuxt'

const hasValueInEntry = (entry: any) => 'value' in entry

export const getAdvancedAttributes = ({
  product,
  property,
}: {
  product: Product
  property: string
}) => {
  const valueList = getFlattenedVariantCrosssellings(
    product?.advancedAttributes?.[property]?.values || [],
  )
  return valueList
    .filter(hasValueInEntry)
    .map((item) => 'value' in item && item.value)
    .join(',')
}

export default {
  getAdvancedAttributes,
  getAttributeValue,
  getAttributeValueTuples,
  getFirstAttributeValue,
}
