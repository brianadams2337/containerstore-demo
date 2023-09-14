import { Product, getFirstAttributeValue } from '@scayle/storefront-nuxt'
import { Action } from '~/constants'

export const showAddToBasketToast = (
  isAddedToBasket: boolean,
  item: Product | null,
) => {
  const { $i18n, $alert } = useNuxtApp()

  const productName =
    getFirstAttributeValue(item?.attributes, 'name')?.label ||
    $i18n.t('wishlist.product')

  const message = $i18n.t('basket.notification.add_to_basket_success', {
    productName,
  })

  const action = isAddedToBasket ? Action.ROUTE : Action.CONFIRM
  $alert.show(
    message,
    action,
    isAddedToBasket ? { name: routeList.basket.name } : undefined,
  )
}
