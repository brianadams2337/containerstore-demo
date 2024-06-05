import { isEmpty } from 'radash'
import {
  type WishlistItem,
  type Product,
  type Value,
  getVariantBySize,
  getAttributeValue,
  getVariant,
} from '@scayle/storefront-nuxt'

export async function useWishlistItemActions(item: Ref<WishlistItem>) {
  const { $i18n } = useNuxtApp()

  const toast = useToast()
  const product = item.value.product

  const { openBasketFlyout } = useFlyouts()
  const { trackAddToBasket } = useTrackingEvents()

  const isChangingSize = useState(`changing-size-${product.id}`, () => false)

  const sizeSavingId = useState<number | null>(
    `size-saving-id-${product.id}`,
    () => null,
  )

  const isAddToBasketButtonShown = useState(
    `is-add-to-basket-button-shown-${product.id}`,
    () => false,
  )

  const { toggle: toggleFilter } = useSlideIn(`wishlistcard_${product.id}`)

  const [
    { replaceItem: replaceWishlistItem },
    { sizes, selectedSize },
    { showAddToBasketToast },
    { highestPriorityPromotion, isBuyXGetYPrioritized },
    basket,
  ] = await Promise.all([
    useWishlist(),
    useWishlistItem(item),
    useBasketActions(),
    useProductPromotions(product),
    useBasket(),
  ])

  const promotionId = computed(() => highestPriorityPromotion.value?.id)

  const addItemToCart = async (index: number) => {
    if (!item.value.variant && item.value.variantId) {
      item.value.variant = getVariant(product.variants!, item.value.variantId)
    }

    if (
      !item.value.variant &&
      product.variants?.length === 1 &&
      getAttributeValue(product.variants[0]?.attributes, 'size') ===
        ONE_SIZE_KEY
    ) {
      item.value.variant = product.variants[0]
    }

    if (!item.value.variant?.id) {
      toast.show($i18n.t('basket.notification.select_size'), 'CONFIRM')
      return
    }

    await basket.addItem({
      variantId: item.value.variant.id,
      quantity: 1,
      ...(!promotionId.value && { promotionId: null }),
      ...(promotionId.value &&
        !isBuyXGetYPrioritized.value && { promotionId: promotionId.value }),
    })

    openBasketFlyout()

    if (!item.value.variant && product.variants?.length) {
      item.value.variant = product.variants[0]
    }

    trackAddToBasket({
      product,
      variant: item.value.variant,
      index,
      list: wishlistListingMetadata,
    })
  }

  const getSize = (value: string): VariantSize | undefined => {
    return sizes.value.find((size) => size.value === value)
  }

  const changeSizeAndAddToBasket = async (
    product: Product,
    size: VariantSize,
    index: number,
  ) => {
    const newVariant = getVariantBySize(product.variants || [], size, 'size')
    if (isEmpty(newVariant)) {
      return
    }
    sizeSavingId.value = product.id
    replaceWishlistItem(
      { productId: product.id },
      { variantId: newVariant!.id },
    )

    await basket.addItem({
      variantId: newVariant!.id,
      quantity: 1,
      ...(!promotionId.value && { promotionId: null }),
      ...(promotionId.value &&
        !isBuyXGetYPrioritized.value && { promotionId: promotionId.value }),
    })

    trackAddToBasket({
      product,
      variant: newVariant,
      index,
      list: wishlistListingMetadata,
    })

    showAddToBasketToast(true, product)

    sizeSavingId.value = null
  }

  const selectRadioSize = (value: string, index: number) => {
    const size = getSize(value)

    if (size) {
      changeSizeAndAddToBasket(product, size, index)
      toggleFilter()
    }
  }

  const showSizePicker = (index: number) => {
    const oneSize = getSize(ONE_SIZE_KEY)

    oneSize ? changeSizeAndAddToBasket(product, oneSize, index) : toggleFilter()
  }

  const changeSize = async (size: Value) => {
    const newVariant = getVariantBySize(product.variants || [], size, 'size')
    if (isEmpty(newVariant)) {
      return
    }
    sizeSavingId.value = product.id

    await replaceWishlistItem(
      { productId: product.id },
      { variantId: newVariant!.id },
    )

    sizeSavingId.value = null
  }

  const selectPickerSize = (size: Value): void => {
    if (size.value !== selectedSize.value?.value) {
      changeSize(size)
    }
    isChangingSize.value = false
  }

  return {
    addItemToCart,
    toggleFilter,
    showSizePicker,
    selectPickerSize,
    selectRadioSize,
    isChangingSize,
    sizeSavingId,
    isAddToBasketButtonShown,
  }
}
