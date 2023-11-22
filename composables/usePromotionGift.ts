import {
  type Variant,
  type Product,
  type Value,
  getAttributeValue,
  getFirstAttributeValue,
  getPrice,
  getVariantBySize,
  getProductSiblings,
} from '@scayle/storefront-nuxt'

export default async (productGift: Product) => {
  const { $alert, $i18n } = useNuxtApp()

  const { product } = await useProductDetails()

  const { fetching: basketIdle, addItem: addBasketItem } = await useBasket()

  const { trackAddToBasket } = useTrackingEvents()

  const { openBasketFlyout } = useFlyouts()

  const gift = toRef(productGift)

  const { buyXGetYPromotion } = await useProductPromotions(product)

  const activeVariant = useState<Variant | null | undefined>(
    `active-gift-variant-${gift.value.id}`,
  )

  const isSelectionShown = useState(
    `gift-selection-${gift.value.id}`,
    () => false,
  )

  const toggleGiftSelection = () => {
    isSelectionShown.value = !isSelectionShown.value
  }

  const isGiftSelectionShown = computed(() => isSelectionShown.value)

  const {
    brand,
    name: productName,
    variantWithLowestPrice,
  } = useProductBaseInfo(gift)

  const lowestPriorPrice = computed(
    () =>
      activeVariant.value?.lowestPriorPrice ||
      variantWithLowestPrice.value?.lowestPriorPrice ||
      gift.value?.lowestPriorPrice,
  )

  const price = computed(() =>
    activeVariant.value
      ? getPrice(activeVariant.value)
      : variantWithLowestPrice.value?.price,
  )

  const handleSelectedSize = (value: Value) => {
    if (gift.value.variants) {
      activeVariant.value = getVariantBySize(gift.value.variants, value, 'size')
    }
  }

  const size = computed(() => {
    return getFirstAttributeValue(activeVariant.value?.attributes, 'size')
      ?.value
  })

  const hasOneSizeVariantOnly = computed(() => {
    const variants = gift.value.variants
    return (
      variants?.length === 1 &&
      getAttributeValue(variants[0].attributes, 'size') === ONE_SIZE_KEY
    )
  })

  const hasSpecial = computed(() => {
    return Boolean(
      !activeVariant.value && price.value?.appliedReductions.length,
    )
  })

  const siblings = computed(() => {
    return getProductSiblings(gift.value, 'color') || []
  })

  const images = computed(() => gift.value.images)

  const addItemToBasket = async () => {
    if (hasOneSizeVariantOnly.value && gift.value?.variants) {
      activeVariant.value = gift.value.variants[0]
    }

    if (!activeVariant.value) {
      $alert.show($i18n.t('basket.notification.select_size'), 'CONFIRM')
      return
    }

    const productName = brand.value || $i18n.t('wishlist.product')

    try {
      await addBasketItem({
        variantId: activeVariant.value.id,
        quantity: 1,
        ...(buyXGetYPromotion.value && {
          promotionId: buyXGetYPromotion.value.id,
        }),
      })

      openBasketFlyout()

      showAddToBasketToast(true, gift.value)

      if (gift.value) {
        trackAddToBasket({
          product: gift.value,
          variant: activeVariant.value,
          index: 1,
        })
      }
    } catch {
      $alert.show(
        $i18n.t('basket.notification.add_to_basket_error', { productName }),
        'CONFIRM',
      )
    }
  }

  return {
    basketIdle,
    productName,
    brand,
    siblings,
    images,
    hasSpecial,
    addItemToBasket,
    lowestPriorPrice,
    handleSelectedSize,
    size,
    price,
    hasOneSizeVariantOnly,
    activeVariant,
    isGiftSelectionShown,
    toggleGiftSelection,
  }
}
