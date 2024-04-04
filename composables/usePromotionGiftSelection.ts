import {
  type Variant,
  type Product,
  type Value,
  ExistingItemHandling,
  getFirstAttributeValue,
  getPrice,
  getVariantBySize,
} from '@scayle/storefront-nuxt'

export async function usePromotionGiftSelection(
  gift: Product,
  promotedProduct?: Product,
) {
  const { $i18n } = useNuxtApp()
  const notification = useNotification()

  const route = useRoute()

  const { fetching: basketIdle, addItem: addBasketItem } = await useBasket()

  const { showAddToBasketToast } = await useBasketActions()

  const { trackAddToBasket } = useTrackingEvents()
  const localePath = useLocalePath()

  const { openBasketFlyout } = useFlyouts()

  const activeVariant = useState<Variant | null | undefined>(
    `active-gift-variant-${gift.id}-${promotedProduct?.id ?? ''}`,
  )

  const isSelectionShown = useState(
    `gift-selection-${gift.id}-${promotedProduct?.id ?? ''}`,
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
      gift?.lowestPriorPrice,
  )

  const price = computed(() =>
    activeVariant.value
      ? getPrice(activeVariant.value)
      : variantWithLowestPrice.value?.price,
  )

  const handleSelectedSize = (value: Value) => {
    if (gift.variants) {
      activeVariant.value = getVariantBySize(gift.variants, value, 'size')
    }
  }

  const size = computed(() => {
    return getFirstAttributeValue(activeVariant.value?.attributes, 'size')
      ?.value
  })

  const hasOneSizeVariantOnly = computed(() => {
    return hasOneSizeProductVariantOnly(gift)
  })

  const hasSpecial = computed(() => {
    return Boolean(
      !activeVariant.value && price.value?.appliedReductions.length,
    )
  })

  const images = computed(() => gift.images)

  const addItemToBasket = async (promotionId?: string) => {
    if (hasOneSizeVariantOnly.value && gift?.variants) {
      activeVariant.value = gift.variants[0]
    }

    if (!activeVariant.value) {
      notification.show($i18n.t('basket.notification.select_size'), 'CONFIRM')
      return
    }

    const productName = brand.value || $i18n.t('wishlist.product')

    try {
      await addBasketItem({
        variantId: activeVariant.value.id,
        quantity: 1,
        existingItemHandling: ExistingItemHandling.ReplaceExisting,
        ...(promotionId && { promotionId }),
      })

      openBasketFlyout()

      if (route.path !== localePath(routeList.basket)) {
        showAddToBasketToast(true, gift)
      }

      if (gift) {
        trackAddToBasket({
          product: gift,
          variant: activeVariant.value,
          index: 1,
        })
      }
    } catch {
      notification.show(
        $i18n.t('basket.notification.add_to_basket_error', { productName }),
        'CONFIRM',
      )
    } finally {
      activeVariant.value = null
      toggleGiftSelection()
    }
  }

  return {
    basketIdle,
    productName,
    brand,
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
