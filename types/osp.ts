import {
  AttributeGroup,
  AttributeGroupSingle,
  AttributeGroupMulti,
  AdvancedAttribute,
  LowestPriorPrice,
  Order as BaseOrder,
} from '@scayle/storefront-nuxt'

type OrderAttribute = Omit<AttributeGroup, 'id' | 'type'>
type OrderAdvancedAttribute = Omit<AdvancedAttribute, 'id' | 'type'>

interface OrderCategory {
  categoryHidden: boolean
  categoryId: number
  categoryName: string
  categorySlug: string
  categoryUrl: string
}

export type OrderPrice = Exclude<BaseOrder['items'], undefined>[0]['price']

// The product and variant data returned in the order payload varies by tenant
// We define it here to get strict typing

export interface OrderProduct {
  advancedAttributes: {
    [k: string]: OrderAdvancedAttribute
    advColor: OrderAdvancedAttribute
    productName: OrderAdvancedAttribute
  }
  attributes: {
    [k: string]: OrderAttribute
    brand: AttributeGroupSingle
    brandLogo: AttributeGroupSingle
    category: AttributeGroupMulti
    color: AttributeGroupSingle
    colorHex: AttributeGroupSingle
    description: AttributeGroupSingle
    name: AttributeGroupSingle
  }
  categories: OrderCategory[][]
  createdAt: string
  id: number
  images: {
    hash: string
  }[]
  masterKey: string
  name: string
  updatedAt: string
}

export interface OrderVariant {
  attributes: {
    [k: string]: OrderAttribute
    size: AttributeGroupSingle
  }
  createdAt: string
  id: number
  images: {
    hash: string
  }[]
  referenceKey: string
  lowestPriorPrice: LowestPriorPrice
  stock: {
    isSellableWithoutStock: boolean
    quantity: number
    supplierId: number
    warehouseId: number
  }
  updatedAt: string
}

type OrderItem = Exclude<
  Exclude<BaseOrder['items'], undefined>[number],
  'product' | 'variant'
> & {
  product: OrderProduct
  variant: OrderVariant
}

export type Order = BaseOrder & { items?: OrderItem[] }

export type OrderAddress = Exclude<Order['address'], undefined>['billing']
