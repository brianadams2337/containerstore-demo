import {
  getAppliedReductionsByCategory,
  getFirstAttributeValue,
  getLowestPrice,
  getOriginalPrice,
  getPrice,
  type AppliedReduction,
  type ListOfPackages,
  type Order,
  type PackageReference,
  type Price,
  type Product,
  type ProductCategory,
  type Variant,
  type WishlistResponseData,
  type BasketResponseData,
} from '@scayle/storefront-nuxt'

// TODO: Add tests

/**
 * Checks if event is one of: AdditionalTrackingEvent = 'cart' | 'wishlist' | 'search' | 'filter_flyout' | 'filter_slider'
 */
export const isAdditionalTrackingEvent = (
  event: TrackingEvent,
): event is AdditionalTrackingEvent => {
  return ['cart', 'wishlist'].includes(<AdditionalTrackingEvent>event)
}

/**
 * Checks if event is one of: 'add_to_wishlist' | 'remove_from_wishlist' | 'select_item'
 */
export const isEcommerceTrackingEvent = (event: TrackingEvent): boolean => {
  return ['add_to_wishlist', 'remove_from_wishlist', 'select_item'].includes(
    event,
  )
}

export const isViewCartEvent = (
  event: TrackingEvent,
): event is EcommerceTrackingEvent => {
  return ['view_cart'].includes(<EcommerceTrackingEvent>event)
}

/**
 * Checks if event is one of: 'view_promotion', 'select_promotion'
 */
export const isPromotionTrackingEvent = (event: TrackingEvent): boolean => {
  return ['view_promotion', 'select_promotion'].includes(event)
}

/**
 * Checks if payload.items exists
 */
export const isProductImpressionsData = (
  data: TrackingPayload | MultipleActionData,
): data is MultipleActionData => {
  return !!(<MultipleActionData>data).items
}

export const mapProductToTrackingPayload = (
  product: Product,
  variant?: Variant,
): ProductInfo => {
  const price = variant
    ? getPrice(variant)
    : getLowestPrice(product.variants || [])
  const getFloatedReducedPriceForCategoryOrNull = (
    price: Price,
    type: 'sale' | 'campaign',
  ) =>
    divideByHundred(
      getAppliedReductionsByCategory(price, type)[0]?.amount.absoluteWithTax,
    ) || 0.0

  const itemBrand =
    getFirstAttributeValue(product.attributes, 'brand')?.label || ''
  const itemBrandId =
    getFirstAttributeValue(product.attributes, 'brand')?.id?.toString() || ''

  return {
    item_id: product.id.toString(),
    item_name: getFirstAttributeValue(product.attributes, 'name')!.label,
    price: divideByHundred(price.withoutTax),
    sale_discount: getFloatedReducedPriceForCategoryOrNull(price, 'sale'),
    campaign_discount: getFloatedReducedPriceForCategoryOrNull(
      price,
      'campaign',
    ),
    original_price: divideByHundred(getOriginalPrice(price)),
    tax: divideByHundred(getOriginalPrice(price) - price.withoutTax),
    item_brand: itemBrand,
    item_brand_id: itemBrandId,
  }
}

const mapAdditionalInfo = (
  data: ProductActionData | ProductListData | ProductViewData,
): AdditionalInfo | ViewInfo => {
  const {
    product,
    list,
    quantity = 1,
  } = data as ProductViewData & ProductActionData

  const { name, id } = data.category ||
    getDeepestCategoryForTracking(product.categories) || { name: '', id: '' }

  const hasListIndex = list?.index && list.index > -1

  return {
    item_category: name,
    item_category_id: id,
    item_variant: product.variants![0].id.toString(),
    item_list_name: list?.name || '',
    item_list_id: list?.id || '',
    sold_out: product.isSoldOut,
    quantity: quantity > -1 ? String(quantity) : '0',
    ...('source' in data && { source: data.source }),
    ...('destination' in data && { destination: data.destination }),
    ...('destinationUrl' in data && { destination_url: data.destinationUrl }),
    ...('variant' in data && { item_variant: data.variant?.id.toString() }),
    ...(hasListIndex && { index: list?.index }),
    ...('index' in product &&
      !hasListIndex &&
      (product as any).index > -1 && { index: product.index }),
  } as AdditionalInfo | ViewInfo
}

const getTotalPriceInfo = (
  items: {
    quantity: number
    campaign_discount: number
    sale_discount: number
    price: number
    priceWithTax: number
  }[],
) => {
  const total = {
    total_campaign_reduction_with_tax: 0.0,
    total_sale_reduction_with_tax: 0.0,
    total_with_tax: 0.0,
    total_without_tax: 0.0,
  }

  items.forEach((item) => {
    total.total_campaign_reduction_with_tax +=
      item.campaign_discount * item.quantity
    total.total_sale_reduction_with_tax += item.sale_discount * item.quantity
    total.total_with_tax += item.priceWithTax * item.quantity
    total.total_without_tax += item.price * item.quantity
  })

  Object.keys(total).forEach(
    (key) =>
      ((total as any)[key] = Number(
        ((total as any)[key] as number).toFixed(2),
      )),
  )

  return total
}

export const mapCustomerInfoToTrackingPayload = ({
  method,
  eh,
  status,
  login_method: loginMethod,
  customer_id: customerId,
  customer_type: customerType = 'new',
  content_name: contentName,
}: CustomerData): CustomerInfo => {
  const mappedPayload: CustomerInfo = {
    ...(loginMethod ? { login_method: loginMethod } : { method }),
    eh: eh || '',
    customer_type: customerType,
    content_name: contentName,
    status,
  }
  if (customerId) {
    mappedPayload.customer_id = customerId
  }
  return mappedPayload
}

// @TODO Refactor to reduce complexity
export const mapTrackingDataForEvent = (
  event: TrackingEvent,
  payload: TrackingPayload,
) => {
  let data = {}
  if (isPromotionTrackingEvent(event)) {
    data = {
      ecommerce: payload,
    }
  } else if (
    isAdditionalTrackingEvent(event) &&
    isProductImpressionsData(payload)
  ) {
    const items = payload.items.map((payload) => ({
      ...mapProductToTrackingPayload(payload.product),
      ...mapAdditionalInfo(payload),
    }))

    // @ts-expect-error Property 'items' does not exist on type '{}'.
    data.items = items
    const totalPrice = getTotalPriceInfo(
      items.map((item) => ({
        price: item.price,
        quantity: item.quantity ? parseInt(item.quantity!) : 1,
        campaign_discount: item.campaign_discount,
        sale_discount: item.sale_discount,
        priceWithTax: item.original_price,
      })),
    )

    data = {
      ...data,
      ...totalPrice,
    }
  } else if (isViewCartEvent(event)) {
    // TODO: There might a place to improve this new event handling
    const {
      currencyCode: currency,
      valueWithoutTax: value,
      pagePayload,
      items,
    } = payload as MultipleActionData
    data = {
      ...(pagePayload || {}),
      ...{ currency },
      ...(value ? { value } : { value: 0 }),
      ecommerce: {
        items: items.map((payload) => {
          const price = getLowestPrice(payload.product.variants || [])
          return {
            ...(currency ? { currency } : {}),
            ...mapProductToTrackingPayload(payload.product),
            ...mapAdditionalInfo(payload),
            tax: divideByHundred(price?.tax?.vat?.amount || 0),
          }
        }),
      },
    }
  } else if (isProductImpressionsData(payload)) {
    const { currencyCode: currency, pagePayload } = payload
    data = {
      ...(pagePayload || {}),
      ecommerce: {
        items: payload.items.map((payload) => {
          const price = getLowestPrice(payload.product.variants || [])
          return {
            ...(currency ? { currency } : {}),
            ...mapProductToTrackingPayload(payload.product),
            ...mapAdditionalInfo(payload),
            tax: divideByHundred(price?.tax?.vat?.amount || 0),
          }
        }),
      },
    }
  } else if (
    isEcommerceTrackingEvent(event) &&
    'product' &&
    'currencyCode' in payload &&
    payload.product
  ) {
    const currency = payload.currencyCode
    const { pagePayload } = payload

    data = {
      ...(pagePayload || {}),
      ecommerce: {
        items: [
          {
            ...(currency ? { currency } : {}),
            ...mapProductToTrackingPayload(
              payload.product,
              'variant' in payload ? payload.variant : undefined,
            ),
            ...mapAdditionalInfo(payload),
          },
        ],
      },
    }
    // eslint-disable-next-line no-constant-binary-expression
  } else if ('product' && 'currencyCode' in payload && payload.product) {
    const currency = payload.currencyCode
    const price =
      'variant' in payload && payload.variant
        ? getPrice(payload.variant)
        : getLowestPrice(payload.product.variants || [])
    data = {
      ecommerce: {
        items: [
          {
            ...(currency ? { currency } : {}),
            ...mapProductToTrackingPayload(
              payload.product,
              'variant' in payload ? payload.variant : undefined,
            ),
            ...mapAdditionalInfo(payload),
            tax: divideByHundred(price?.tax.vat.amount || 0),
          },
        ],
      },
    }
    // eslint-disable-next-line no-constant-binary-expression
  } else if ('products' && 'currencyCode' in payload && payload.products) {
    const currency = payload.currencyCode
    const { pagePayload } = payload

    data = {
      ...(pagePayload || {}),
      ecommerce: {
        items: payload.products.map((product) => ({
          ...(currency ? { currency } : {}),
          ...mapProductToTrackingPayload(product),
          ...mapAdditionalInfo({ product }),
        })),
      },
    }
  } else {
    data = {
      ...payload,
    }
  }

  return {
    event,
    ...data,
  }
}

/**
 *
 * @param categories
 * @returns most specific category for a product
 */
function getDeepestCategory(
  categories: ProductCategory[][] = [],
): ProductCategory | null {
  if (!categories.length) {
    return null
  }
  let depth = { index: 0, value: 0 }
  categories.forEach((category, index) => {
    if (category.length > depth.value) {
      depth = { index, value: category.length }
    }
    if (category.length === depth.value) {
      depth.index = index
    }
  })

  return categories[depth.index][categories[depth.index].length - 1]
}

export const getDeepestCategoryForTracking = (
  categories: ProductCategory[][] = [],
): TrackingCategory => {
  const { categoryName, categoryId } = getDeepestCategory(categories) || {
    categoryName: '',
    categoryId: '',
  }
  return {
    name: categoryName,
    id: (categoryId || '').toString(),
  }
}

export const didBasketDataChange = (
  oldData: BasketResponseData | null | undefined,
  newData: BasketResponseData | null | undefined,
) => {
  return !isEqual(
    {
      items: oldData?.items.map((item) => ({
        productId: item.product?.id,
        variantId: item.variant?.id,
        price: item.product?.priceRange,
        quantity: item.quantity,
        soldOut: item.product?.isSoldOut,
      })),
      key: oldData?.key,
    },
    {
      items: newData?.items.map((item) => ({
        productId: item.product?.id,
        variantId: item.variant?.id,
        price: item.product?.priceRange,
        quantity: item.quantity,
        soldOut: item.product?.isSoldOut,
      })),
      key: newData?.key,
    },
  )
}

export const didWishlistDataChange = (
  oldData: WishlistResponseData | null | undefined,
  newData: WishlistResponseData | null | undefined,
) => {
  return !isEqual(
    {
      items: oldData?.items.map((item) => ({
        productId: item.product?.id,
        variantId: item.variant?.id,
        soldOut: item.product?.isSoldOut,
      })),
      key: oldData?.key,
    },
    {
      items: newData?.items.map((item) => ({
        productId: item.product?.id,
        variantId: item.variant?.id,
        soldOut: item.product?.isSoldOut,
      })),
      key: newData?.key,
    },
  )
}

// same as formatPrice from @scayle/storefront-nuxt2 without using the useContext
export const formatPriceWithCurrency = (
  value: number,
  locale: string,
  currency: string,
): string => {
  const currencyFractionDigits = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).resolvedOptions().maximumFractionDigits

  return divideByHundred(value).toLocaleString(locale, {
    minimumFractionDigits: currencyFractionDigits,
  })
}

export const sumReductions = (reductions: AppliedReduction[]) => {
  if (!reductions) {
    return 0
  }
  return reductions.reduce((sum: number, reduction: AppliedReduction) => {
    return sum + reduction.amount.absoluteWithTax
  }, 0)
}

export const sumReductionsByCategory = (
  reductions?: AppliedReduction[],
  category?: AppliedReduction['category'],
) => {
  if (!reductions) {
    return 0
  }
  return sumReductions(
    reductions.filter((reduction) => reduction.category === category),
  )
}

export const sumReductionsFromAllOrderItemsPerCategory = (
  orderItems: Order['items'],
  category: AppliedReduction['category'],
) => {
  if (!orderItems) {
    return 0
  }
  return orderItems.reduce((sum: number, orderItem: any) => {
    return (
      sum +
      sumReductionsByCategory(orderItem?.price?.appliedReductions, category)
    )
  }, 0)
}

export const getFirstCarrierKey = (orderData: any) => {
  return orderData.packages?.[0]?.carrierKey
}

export const getCarrier = (
  packages: Order['packages'],
  packageId: PackageReference,
) => {
  return packages?.find((p) => p.id === packageId) as ListOfPackages[0]
}

export const getGiftcardAmount = ({
  amount,
  currency,
  locale,
}: {
  amount: number
  currency: string
  locale: string
}) => {
  const numberParts = new Intl.NumberFormat(locale.replace('_', '-'), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).formatToParts(amount)
  const currencySymbol = numberParts.find(({ type }) => type === 'currency')
    ?.value
  const number = numberParts
    .filter(({ type }) => !['currency', 'literal'].includes(type))
    .map(({ value }) => value)
    .join('')
  return `${number}${currencySymbol}`
}

/**
 * Orders can only have vouchers(same as coupons) with a particular type, like 'relative' or 'absolute'. Dependending on this type the value is calculated differently.
 *
 * voucherType is optional and is derived from orderData if not provided
 * @param orderData
 * @param [voucherType]
 * @returns
 */
export const getCouponReductionWithTax = ({
  orderData,
  voucherType,
}: {
  orderData: Order
  voucherType?: 'absolute' | 'relative'
}) => {
  const orderVoucherType = voucherType ?? orderData.vouchers?.[0]?.type
  if (
    !orderData.vouchers?.[0] ||
    orderData.vouchers?.length === 0 ||
    orderVoucherType === undefined
  ) {
    return 0
  }
  if (orderVoucherType === 'absolute') {
    return divideByHundred(orderData.vouchers[0].value)
  }
  if (orderVoucherType === 'relative') {
    return divideByHundred(
      sumReductionsFromAllOrderItemsPerCategory(orderData.items, 'voucher'),
    )
  }
}

export const getEmailHash = async (email: string | undefined) => {
  if (!email) {
    return ''
  }
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(email.replace(/ /g, '')?.toLowerCase()),
  )
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
