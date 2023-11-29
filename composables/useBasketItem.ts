import {
  type BasketItem,
  getBadgeLabel,
  getFirstAttributeValue,
  getProductColors,
  getSizeFromVariant,
  ExistingItemHandling,
  getTotalAppliedReductions,
  isInStock,
} from '@scayle/storefront-nuxt'

export default async (basketItem: Ref<BasketItem>) => {
  const product = computed(() => basketItem.value.product)
  const { highestPriorityPromotion } = await useProductPromotions(product.value)

  const { removeItem: removeBasketItem, listingMetaData } =
    await useBasketActions()

  const basket = await useBasket()

  const route = useRoute()
  const store = useStore()
  const currentShop = useCurrentShop()

  const { trackAddToBasket, trackRemoveFromBasket, trackSelectItem } =
    useTrackingEvents()

  const { setUiState, uiState } = useBasketItemUiState()

  const { name, brand, image } = useProductBaseInfo(product.value)

  const variant = computed(() => basketItem.value!.variant)
  const inStock = computed(() => isInStock(variant.value))

  const size = computed(() => {
    return getSizeFromVariant(basketItem.value!.variant, 'size')?.label
  })

  const color = computed(() => {
    return getProductColors(product.value, 'color').join('/')
  })

  const price = computed(() => basketItem.value?.price.total.withTax ?? 0)

  const lowestPriorPrice = computed(() => {
    return basketItem.value?.variant.lowestPriorPrice
  })

  const quantity = computed(() => basketItem.value?.quantity)

  const isSoldOut = computed(() => basketItem.value?.product.isSoldOut)

  const cupsizeLabel = computed(() => {
    return getFirstAttributeValue(
      basketItem.value?.variant.attributes,
      'cupsize',
    )?.label
  })

  const badgeLabel = computed(() => {
    return getBadgeLabel({
      isSoldOut: basketItem.value?.product.isSoldOut,
    })
  })

  const availableQuantity = computed(() => {
    return getQuantitySelectionList(basketItem.value?.availableQuantity)
  })

  const reducedPrice = computed(() => {
    const total = basketItem.value?.price.total
    if (!total) {
      return
    }
    return getTotalAppliedReductions(total)?.absoluteWithTax
  })

  const changeQuantity = async (newQuantity: number, index: number) => {
    if (newQuantity === 0) {
      return onPressDelete()
    }
    const basketItem = basket.findItem({ variantId: variant.value.id })
    if (!basketItem) {
      return
    }

    const promotionId = highestPriorityPromotion.value?.id

    if (basketItem.quantity < newQuantity) {
      trackAddToBasket({
        product: product.value,
        quantity: newQuantity - basketItem.quantity,
        variant: variant.value,
        index,
        list: listingMetaData,
      })
    } else if (basketItem.quantity > newQuantity) {
      trackRemoveFromBasket(
        product.value,
        basketItem.quantity - newQuantity,
        variant.value,
        index,
      )
    }

    await basket.addItem({
      variantId: variant.value.id,
      quantity: newQuantity,
      existingItemHandling: ExistingItemHandling.ReplaceExisting,
      ...(promotionId && { promotionId }),
    })
  }

  const isLowestPreviousPriceActive = computed(() => {
    return !!currentShop.value?.isLowestPreviousPriceActive
  })

  const trackProductClick = () => {
    trackSelectItem({
      product: product.value,
      listingMetaData,
      pagePayload: {
        content_name: route.fullPath,
        page_type: store.value.pageType,
        page_type_id: route.params.id?.toString() || '',
      },
    })
  }

  const removeItem = () => removeBasketItem(basketItem.value)

  const onPressDelete = () => setUiState('confirmDelete')

  const onCancelDelete = () => setUiState('default')

  const onConfirmDelete = () => {
    setUiState('default')
    removeItem()
  }

  const selectItem = () => trackProductClick()

  return {
    name,
    brand,
    color,
    price,
    lowestPriorPrice,
    quantity,
    availableQuantity,
    inStock,
    isLowestPreviousPriceActive,
    changeQuantity,
    trackProductClick,
    removeItem,
    uiState,
    onCancelDelete,
    onConfirmDelete,
    onPressDelete,
    size,
    image,
    reducedPrice,
    product,
    variant,
    selectItem,
    badgeLabel,
    cupsizeLabel,
    isSoldOut,
    listingMetaData,
  }
}
