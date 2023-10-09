import {
  AttributeGroupSingle,
  AttributeGroupMulti,
  AdvancedAttribute,
  LowestPriorPrice,
  Order as BaseOrder,
  ListOfPackages,
  Attributes,
} from '@scayle/storefront-nuxt'

interface OrderCategory {
  categoryHidden: boolean
  categoryId: number
  categoryName: string
  categorySlug: string
  categoryUrl: string
}

export {}

declare global {
  type OrderAdvancedAttribute = Omit<AdvancedAttribute, 'id' | 'type'>

  type DeliveryDate = ListOfPackages[0]['deliveryDate']

  type OrderPrice = Exclude<BaseOrder['items'], undefined>[0]['price']

  // The product and variant data returned in the order payload varies by tenant
  // We define it here to get strict typing

  interface OrderProduct {
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

  interface OrderVariant {
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

  type OrderItem = Exclude<
    Exclude<BaseOrder['items'], undefined>[number],
    'product' | 'variant'
  > & {
    product: OrderProduct
    variant: OrderVariant
  }

  type Order = BaseOrder & { items?: OrderItem[] }

  type OrderItems = OrderItem[]

  type OrderAddress = Exclude<Order['address'], undefined>['billing']

  type Package = ListOfPackages[0]
}
