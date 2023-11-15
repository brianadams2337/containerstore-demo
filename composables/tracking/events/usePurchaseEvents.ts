import {
  getItemQuantityFromOrder,
  getUniqueItemsFromOrder,
  getTotalAppliedReductions,
  type Value,
  type Price,
  type Order,
  type Product,
  type ProductCategory,
} from '@scayle/storefront-nuxt'

const getItems = (orderData: Order, currency?: string) => {
  const defaultEmptyValue = ''
  return getUniqueItemsFromOrder(orderData)?.map((orderItem, index: number) => {
    const product = orderItem.product as unknown as Product & OrderItemProduct
    const variant = orderItem.variant as unknown as OrderItemVariant
    const price = orderItem.price as unknown as Price
    const brandValue = product.attributes?.brand?.values as Value
    const { name: itemCategoryName, id: itemCategoryId } =
      getDeepestCategoryForTracking(
        orderItem?.product?.categories as ProductCategory[][],
      )
    return {
      item_id: product.id,
      item_name: product.name,
      price: divideWithHundred(price?.withTax),
      tax: divideWithHundred(price?.tax?.vat?.amount || 0),
      currency,
      item_brand: brandValue.label || defaultEmptyValue,
      item_brand_id: brandValue.id || defaultEmptyValue,
      item_variant: variant.id,
      quantity: getItemQuantityFromOrder(orderData, variant.id),
      item_list_name: defaultEmptyValue,
      item_list_id: defaultEmptyValue,
      index: index + 1,
      item_category: itemCategoryName || defaultEmptyValue,
      item_category_id: itemCategoryId || defaultEmptyValue,
      carrier:
        getCarrier(orderData.packages, orderItem.packageId)?.carrierKey ||
        defaultEmptyValue,
      sale_discount: divideWithHundred(
        sumReductionsByCategory(price?.appliedReductions, 'sale'),
      ),
      campaign_discount: divideWithHundred(
        sumReductionsByCategory(price?.appliedReductions, 'campaign'),
      ),
      original_price:
        price.appliedReductions?.length > 0
          ? divideWithHundred(
              getTotalAppliedReductions(price)?.absoluteWithTax +
                (price?.withTax ?? 0),
            )
          : divideWithHundred(price?.withTax),

      ...(product.isSoldOut && { sold_out: true }),
    }
  })
}

const usePurchaseEvents = (): {
  trackPurchaseEvent: (orderData: Order) => void
} => {
  const store = useStore()
  const { $tracking } = useNuxtApp()

  return {
    trackPurchaseEvent: (orderData: Order) => {
      const defaultEmptyValue = ''
      const paymentType = orderData?.payment?.[0].key
      const moneyLocale = 'en-EN' // for money formatting analytics requires en-EN so that every shop value is formatted the same way
      const currency = useCurrentShop().value?.currency
      const giftcard = getGiftcardAmount({
        amount: 0, // TODO if giftcard is implemented this should change to the right amount
        currency: currency ?? 'USD',
        locale: moneyLocale,
      })
      const coupon = orderData.vouchers?.[0]?.code ?? defaultEmptyValue // only one voucher can be applied for now
      const couponReductionWithTax = getCouponReductionWithTax({
        orderData,
      })

      const items = getItems(orderData, currency)

      const shippingNetFee = orderData.cost.appliedFees
        ? getShippingNetFee(orderData.cost.appliedFees)
        : null

      const ecommerce = {
        transaction_id: String(orderData.id),
        customer_id: String(orderData.customer?.id),
        value: divideWithHundred(orderData.cost.withoutTax),
        sale_reduction_with_tax: divideWithHundred(
          sumReductionsFromAllOrderItemsPerCategory(orderData.items, 'sale'),
        ),
        campaign_reduction_with_tax: divideWithHundred(
          sumReductionsFromAllOrderItemsPerCategory(
            orderData.items,
            'campaign',
          ),
        ),
        coupon_reduction_with_tax: couponReductionWithTax,
        coupon,
        coupon_code: coupon,
        // giftcard === "<amount><currency>" e.g. 10€ mentioned here: https://aboutyou.atlassian.net/wiki/spaces/AYC/pages/979207502/SFC+v2+Tracking+Integration
        giftcard,
        tax: divideWithHundred(orderData.cost.tax.vat?.amount ?? 0),
        shipping: shippingNetFee
          ? divideWithHundred(shippingNetFee)
          : divideWithHundred(orderData?.shipping?.deliveryCosts || 0),
        payment_type: paymentType,
        items,
      }

      $tracking.push({
        event: 'purchase',
        ecommerce,
        content_name: document.location.pathname,
        page_type: store.value.pageType,
        page_type_id: store.value.pageTypeId,
      })
    },
  }
}

export default usePurchaseEvents
