import type { Product, Variant } from '@scayle/storefront-nuxt'
import { usePageState } from '~/composables/usePageState'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import type { ListItem } from '~/types/tracking'

import { useRoute } from '#app/composables/router'

export function useWishlistActions() {
  const { trackRemoveFromWishlist, trackAddToWishlist } = useTrackingEvents()

  const route = useRoute()
  const { pageState } = usePageState()

  const trackWishlistEvent = (
    action: 'added' | 'removed',
    params: {
      product: Product | null
      variant?: Variant
      listingMetaData?: ListItem
    },
  ) => {
    const { product, variant, listingMetaData } = params
    if (!product) {
      return
    }

    const payload = {
      product,
      ...(action === 'added' && { variant }),
      listingMetaData,
      pagePayload: {
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: route.params.id?.toString() || '',
      },
    }

    return action === 'added'
      ? trackAddToWishlist(payload)
      : trackRemoveFromWishlist(payload)
  }

  return {
    trackWishlistEvent,
  }
}
