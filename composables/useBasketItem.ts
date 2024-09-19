import {
  type BasketItem,
  ExistingItemHandling,
  getFirstAttributeValue,
  getProductColors,
  getSizeFromVariant,
  getTotalAppliedReductions,
  isInStock,
  extendPromise,
  type PublicShopConfig,
} from '@scayle/storefront-nuxt'
import { type Ref, computed, nextTick } from 'vue'
import { isBuyXGetYType } from '~/utils/promotion'
import { useBasketActions } from '~/composables/useBasketActions'
import { useBasketItemUiState } from '~/composables/useBasketItemUiState'
import { usePageState } from '~/composables/usePageState'
import { useProductBaseInfo } from '~/composables/useProductBaseInfo'
import { useProductPromotions } from '~/composables/useProductPromotions'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useCurrentShop, useBasket } from '#storefront/composables'
import { getQuantitySelectionList, getVariantIds } from '~/utils'
import { useRoute } from '#app/composables/router'

export function useBasketItem(basketItem: Ref<BasketItem>) {
  const product = computed(() => basketItem.value.product)

  const route = useRoute()
  const { pageState } = usePageState()
  const currentShop = useCurrentShop()

  const { trackAddToBasket, trackRemoveFromBasket, trackSelectItem } =
    useTrackingEvents()

  const { setUiState, uiState } = useBasketItemUiState(basketItem.value.key)

  const { name, brand, image } = useProductBaseInfo(product.value)

  const basketActions = useBasketActions()
  const basket = useBasket()
  const productPromotions = useProductPromotions(product.value)

  const { removeItem: removeBasketItem, listingMetaData } = basketActions
  const { promotion } = productPromotions

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

  const isFreeGift = computed(() => {
    const variantIds = getVariantIds(basketItem.value.promotion)
    return variantIds.includes(basketItem.value.variant.id)
  })

  const changeQuantity = async (
    newQuantity: number | undefined,
    index: number,
  ) => {
    if (!newQuantity) {
      return
    }

    if (newQuantity === 0) {
      return onPressDelete()
    }
    const basketItem = basket.findItem({ variantId: variant.value.id })
    if (!basketItem) {
      return
    }

    const promotionId = promotion.value?.id

    if (basketItem.quantity < newQuantity) {
      trackAddToBasket({
        product: product.value,
        quantity: newQuantity - basketItem.quantity,
        variant: variant.value,
        index,
        list: listingMetaData,
      })
    } else if (basketItem.quantity > newQuantity) {
      trackRemoveFromBasket({
        product: product.value,
        quantity: basketItem.quantity - newQuantity,
        variant: variant.value,
        index,
      })
    }

    await basket.addItem({
      variantId: variant.value.id,
      quantity: newQuantity,
      existingItemHandling: ExistingItemHandling.ReplaceExisting,
      ...(promotionId &&
        !isBuyXGetYType(promotion.value) &&
        !isFreeGift.value && { promotionId }),
    })

    await nextTick()
  }

  const isLowestPreviousPriceActive = computed(() => {
    return !!(currentShop.value as PublicShopConfig)
      ?.isLowestPreviousPriceActive
  })

  const trackProductClick = () => {
    trackSelectItem({
      product: product.value,
      listingMetaData,
      pagePayload: {
        content_name: route.fullPath,
        page_type: pageState.value.type,
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

  return extendPromise(
    Promise.all([basket, basketActions, productPromotions]).then(() => ({})),
    {
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
      cupsizeLabel,
      isSoldOut,
      listingMetaData,
      isFreeGift,
    },
  )
}
