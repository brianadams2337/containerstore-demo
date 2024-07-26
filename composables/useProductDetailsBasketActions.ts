import type {
  AddOrUpdateItemType,
  Product,
  Variant,
} from '@scayle/storefront-nuxt'
import { unique } from 'radash'
import { type Ref, toValue } from 'vue'
import { isSubscriptionAlreadyInBasket } from '~/modules/subscription/helpers/subscription'
import { hasOneSizeProductVariantOnly } from '~/utils/sizes'
import { useBasketActions } from '~/composables/useBasketActions'
import { useBasketGroup } from '~/composables/useBasketGroup'
import { useFlyouts } from '~/composables/useFlyouts'
import { useProductDetailsAddOns } from '~/composables/useProductDetailsAddOns'
import { useProductPromotions } from '~/composables/useProductPromotions'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useBasket } from '#storefront/composables'
import { useNuxtApp } from '#app'
import { useProductBaseInfo } from '~/composables/useProductBaseInfo'

export function useProductDetailsBasketActions(
  product: Ref<Product>,
  activeVariant: Ref<Variant | undefined>,
  quantity: Ref<number>,
) {
  const app = useNuxtApp()

  const toast = useToast()
  const { trackAddToBasket } = useTrackingEvents()
  const { openBasketFlyout } = useFlyouts()

  const {
    fetching: basketIdle,
    addItem: addBasketItem,
    items: basketItems,
  } = useBasket()
  const { highestPriorityPromotion, isBuyXGetYPrioritized } =
    useProductPromotions(product)
  const { selectedAddOnVariantIds, isAnyAddOnSelected } =
    useProductDetailsAddOns(product.value.id, product)
  const { addGroupToBasket } = useBasketGroup()
  const { showAddToBasketToast } = useBasketActions()

  const { name } = useProductBaseInfo(product)

  const getBasketAddOnProducts = () => {
    return unique(
      (basketItems.value ?? [])
        .filter(({ variant }) =>
          selectedAddOnVariantIds.value.includes(variant.id),
        )
        .map(({ product }) => product),
      (product) => product.id,
    )
  }

  const addItemToBasket = async (priorItemToAdd?: AddOrUpdateItemType) => {
    if (!product.value) {
      return
    }
    const hasOneSizeVariantOnly =
      product.value && hasOneSizeProductVariantOnly(product.value)

    let variantToAdd = toValue(activeVariant)

    if (hasOneSizeVariantOnly && product.value.variants) {
      variantToAdd = product.value.variants[0]
    }

    if (!variantToAdd) {
      toast.show(app.$i18n.t('basket.notification.select_size'), {
        action: 'CONFIRM',
      })
      return
    }

    if (
      isSubscriptionAlreadyInBasket(
        !!priorItemToAdd,
        variantToAdd.id,
        basketItems.value,
      )
    ) {
      toast.show(
        app.$i18n.t(
          'basket.notification.subscription_already_in_basket_error',
          {
            productName: name.value,
          },
        ),
        {
          action: 'CONFIRM',
        },
      )
      return
    }

    const promotionId = highestPriorityPromotion.value?.id

    try {
      if (priorItemToAdd) {
        await addBasketItem(priorItemToAdd)
      } else if (isAnyAddOnSelected.value) {
        await addGroupToBasket({
          mainItem: { variantId: variantToAdd.id, quantity: 1 },
          items: [
            ...selectedAddOnVariantIds.value.map((variantId) => ({
              variantId,
              quantity: 1,
            })),
          ],
        })
      } else {
        await addBasketItem({
          variantId: variantToAdd.id,
          quantity: quantity.value,
          ...(!promotionId && { promotionId: null }),
          ...(promotionId && !isBuyXGetYPrioritized.value && { promotionId }),
        })
      }

      openBasketFlyout()

      showAddToBasketToast(true, product.value)

      if (isAnyAddOnSelected.value) {
        const products = [product.value, ...getBasketAddOnProducts()].map(
          (product, index) => ({
            ...product,
            index: index + 1,
          }),
        )
        trackAddToBasket({ products })
      } else {
        trackAddToBasket({
          product: product.value,
          variant: variantToAdd,
          quantity: quantity.value,
          index: 1,
        })
      }
    } catch {
      toast.show(
        app.$i18n.t('basket.notification.add_to_basket_error', {
          productName: name.value,
        }),
        {
          action: 'CONFIRM',
        },
      )
    }
  }

  return { addItemToBasket, basketIdle, basketItems }
}
