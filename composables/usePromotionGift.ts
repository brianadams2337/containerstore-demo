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

export default async (productItem: Product) => {
  const { $alert, $i18n } = useNuxtApp()

  const { fetching: basketIdle, addItem: addBasketItem } = await useBasket()

  const { trackAddToBasket } = useTrackingEvents()

  const { openBasketFlyout } = useFlyouts()

  const product = toRef(productItem)

  const activeVariant = useState<Variant | null | undefined>(
    `active-gift-variant-${product.value.id}`,
  )

  const isSelectionShown = useState(
    `gift-selection-${product.value.id}`,
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
  } = useProductBaseInfo(product)

  const lowestPriorPrice = computed(
    () =>
      activeVariant.value?.lowestPriorPrice ||
      variantWithLowestPrice.value?.lowestPriorPrice ||
      product.value?.lowestPriorPrice,
  )

  const price = computed(() =>
    activeVariant.value
      ? getPrice(activeVariant.value)
      : variantWithLowestPrice.value?.price,
  )

  const handleSelectedSize = (value: Value) => {
    if (product.value.variants) {
      activeVariant.value = getVariantBySize(
        product.value.variants,
        value,
        'size',
      )
    }
  }

  const size = computed(() => {
    return getFirstAttributeValue(activeVariant.value?.attributes, 'size')
      ?.value
  })

  const hasOneSizeVariantOnly = computed(() => {
    const variants = product.value.variants
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
    return getProductSiblings(product.value, 'color') || []
  })

  const images = computed(() => product.value.images)

  const addItemToBasket = async () => {
    if (hasOneSizeVariantOnly.value && product.value?.variants) {
      activeVariant.value = product.value.variants[0]
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
      })

      openBasketFlyout()

      showAddToBasketToast(true, product.value)

      if (product.value) {
        trackAddToBasket({
          product: product.value,
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
