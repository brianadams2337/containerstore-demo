import type {
  AdvancedAttribute,
  AttributeGroupMulti,
  AttributeGroupSingle,
  Attributes,
  Order as BaseOrder,
  ListOfPackages,
  LowestPriorPrice,
} from '@scayle/storefront-nuxt'

interface OrderCategory {
  categoryHidden: boolean
  categoryId: number
  categoryName: string
  categorySlug: string
  categoryUrl: string
}

export type OrderAdvancedAttribute = Omit<AdvancedAttribute, 'id' | 'type'>

export type DeliveryDate = ListOfPackages[0]['deliveryDate']

export type OrderPrice = Exclude<BaseOrder['items'], undefined>[0]['price']

// The product and variant data returned in the order payload varies by tenant
// We define it here to get strict typing
export interface OrderProduct {
  advancedAttributes: {
    [k: string]: OrderAdvancedAttribute
    advColor: OrderAdvancedAttribute
    productName: OrderAdvancedAttribute
  }
  attributes: Attributes & {
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
  attributes: Attributes & {
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

export type OrderItem = Exclude<
  Exclude<BaseOrder['items'], undefined>[number],
  'product' | 'variant'
> & {
  product: OrderProduct
  variant: OrderVariant
}

export type Order = BaseOrder & { items?: OrderItem[] }

export type OrderItems = OrderItem[]

export type OrderAddress = Exclude<Order['address'], undefined>['billing']

export type Package = ListOfPackages[0]

export type DeliveryInfo = Package & { formattedStatus: string }
