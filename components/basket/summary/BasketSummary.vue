<template>
  <div>
    <div class="rounded border-primary p-0 md:border md:p-6">
      <SFHeadline tag="h1" size="xl">{{ $t('basket.total') }}</SFHeadline>
      <SFFadeInTransition>
        <PromotionHurryToSaveBanners v-if="hasAppliedPromotions" class="mt-4" />
      </SFFadeInTransition>
      <div class="mt-4 space-y-4">
        <BasketSummaryDetails />
        <SFButton
          data-test-id="checkout-link"
          is-full-width
          type="primary"
          class="!normal-case"
          @click="onClickToCheckoutOrder"
        >
          {{ $t('basket.to_checkout') }}
        </SFButton>
        <BasketSummarySellingPoints />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { routeList } from '~/utils/route'
import { BasketListingMetadata } from '~/constants/listingMetadata'
import {
  useBasketPromotions,
  useRouteHelpers,
  useTrackingEvents,
} from '~/composables'
import { useBasket, useUser } from '#storefront/composables'

const basket = await useBasket()
const { isLoggedIn } = await useUser()

const { trackBeginCheckout } = useTrackingEvents()
const { localizedNavigateTo } = useRouteHelpers()

const onClickToCheckoutOrder = async () => {
  trackBeginCheckout(
    basket.data.value?.items,
    BasketListingMetadata.NAME,
    BasketListingMetadata.ID,
  )
  const routeName = isLoggedIn.value
    ? routeList.checkout.name
    : routeList.signin.name

  const isSignInRoute = routeName === routeList.signin.name

  await localizedNavigateTo({
    name: routeName,
    ...(isSignInRoute && { query: { redirectUrl: routeList.checkout.name } }),
  })
}

const { hasAppliedPromotions } = await useBasketPromotions()
</script>
