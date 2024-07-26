import type { CentAmount } from '@scayle/storefront-nuxt'

export interface AttributesFilterValue {
  name: string
  id: number
  productCount: number
  value: string
}

export type BooleanFilterValue = [
  {
    name: true | false
    productCount: number
  },
  {
    name: true | false
    productCount: number
  },
]

export type RangeFilterValue = [
  {
    min: CentAmount
    max: CentAmount
    productCount: number
  },
]

export type FilterItemWithValues =
  | BooleanFilterItemWithValues
  | AttributesFilterItemWithValues
  | RangeFilterItemWithValues

export interface BooleanFilterItemWithValues {
  id: null
  slug: string
  name: string
  values: BooleanFilterValue
  type: 'boolean'
}

export interface AttributesFilterItemWithValues {
  id: number | null
  slug: string
  name: string
  values: AttributesFilterValue[]
  type: 'attributes'
  attributeGroupType: string
}

export interface RangeFilterItemWithValues {
  id: null
  slug: string
  name: string
  values: RangeFilterValue
  type: 'range'
}
