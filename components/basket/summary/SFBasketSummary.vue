<template>
  <div>
    <div class="rounded border-primary p-0 md:border md:p-6">
      <SFHeadline tag="h1" size="xl">{{ $t('basket.total') }}</SFHeadline>
      <SFFadeInTransition>
        <template v-if="hasAppliedPromotions">
          <SFPromotionHurryToSaveBanners
            v-for="promotion in automaticDiscountPromotions"
            :key="promotion.id"
            class="mt-4"
            :promotion="promotion"
          />
          <SFPromotionHurryToSaveBanners
            v-for="promotion in buyXGetYPromotions"
            :key="promotion.id"
            class="mt-4"
            :promotion="promotion"
          />
        </template>
      </SFFadeInTransition>
      <div class="mt-4 space-y-4">
        <SFBasketSummaryDetails />
        <SFButton
          data-testid="checkout-link"
          is-full-width
          variant="primary"
          class="!normal-case"
          @click="onClickToCheckoutOrder"
        >
          {{ $t('basket.to_checkout') }}
        </SFButton>
        <SFBasketSummarySellingPoints />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SFBasketSummarySellingPoints from './SFBasketSummarySellingPoints.vue'
import SFBasketSummaryDetails from './SFBasketSummaryDetails.vue'
import { routeList } from '~/utils/route'
import { BasketListingMetadata } from '~/constants/listingMetadata'
import {
  useBasketPromotions,
  useRouteHelpers,
  useTrackingEvents,
} from '~/composables'
import { useBasket, useUser } from '#storefront/composables'
import SFPromotionHurryToSaveBanners from '~/components/promotion/SFPromotionHurryToSaveBanners.vue'
import {
  SFButton,
  SFFadeInTransition,
  SFHeadline,
} from '#storefront-ui/components'

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

const {
  hasAppliedPromotions,
  buyXGetYPromotions,
  automaticDiscountPromotions,
} = useBasketPromotions()
</script>
