import {
  getAttributeValue,
  getAttributeValueTuples,
  getFirstAttributeValue,
  type Product,
  getFlattenedVariantCrosssellings,
} from '@scayle/storefront-nuxt'

const validObject = (entry: any) => 'value' in entry
export const getAdvancedAttributes = ({
  product,
  property,
}: {
  product: Product
  property: string
}) => {
  const valueList: { value: string }[] = getFlattenedVariantCrosssellings(
    product?.advancedAttributes?.[property]?.values || [],
  ) as unknown as { value: string }[]
  return product
    ? valueList
        .filter(validObject)
        ?.map(({ value }) => value)
        .join(',')
    : null
}

export default {
  getAdvancedAttributes,
  getAttributeValue,
  getAttributeValueTuples,
  getFirstAttributeValue,
}
