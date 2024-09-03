import { useI18n } from 'vue-i18n'
import type { AddOrUpdateItemType } from '@scayle/storefront-nuxt'
import { useToast } from '~/composables/useToast'
import { getBasketToastErrorMessageKey } from '~/utils/basket'
import { routeList } from '~/utils/route'
import { useBasket, useLog } from '#storefront/composables'

export function useAddToBasket() {
  const { addItem: addItemToBasket } = useBasket()
  const { show } = useToast()
  const i18n = useI18n()
  const log = useLog()

  const addItem = async (
    item: AddOrUpdateItemType & { productName: string },
  ) => {
    try {
      await addItemToBasket(item)
      show(
        i18n.t('basket.notification.add_to_basket_success', {
          productName: item.productName,
        }),
        { type: 'SUCCESS', action: 'ROUTE', to: routeList.basket },
      )
    } catch (e) {
      log.error('Item could not be added to basket', e)
      show(
        i18n.t(getBasketToastErrorMessageKey(e), {
          productName: item.productName,
        }),
        { type: 'ERROR', action: 'CONFIRM' },
      )
    }
  }

  return {
    addItem,
  }
}
