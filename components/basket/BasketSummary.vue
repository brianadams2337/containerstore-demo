<template>
  <div>
    <div class="rounded border-primary p-0 md:border md:p-6">
      <Headline tag="div" size="xl">
        {{ $t('basket.total') }}
      </Headline>
      <div class="mt-6 space-y-4">
        <div
          class="flex flex-col justify-between gap-2 text-sm font-bold text-gray-800"
        >
          <div class="flex justify-between">
            <div class="opacity-50">{{ $t('basket.subtotal') }}</div>
            <div v-if="totalCost">{{ toCurrency(totalCost) }}</div>
          </div>

          <div class="flex justify-between">
            <div class="opacity-50">{{ $t('basket.shipping') }}</div>
            <div class="">
              {{
                shippingCost
                  ? toCurrency(shippingCost)
                  : $t('basket.shipping_free')
              }}
            </div>
          </div>

          <hr class="col-span-full my-4 border border-gray-350" />

          <div class="flex justify-between">
            <div class="opacity-50">
              {{ $t('basket.total') }}
            </div>
            <div class="">
              <div v-if="totalCost" class="text-xl">
                {{ toCurrency(totalCost) }}
              </div>
              <div class="text-2xs opacity-50">
                {{ $t('basket.including_vat') }}
              </div>
            </div>
          </div>
        </div>
        <AppButton
          data-test-id="checkout-link"
          is-full-width
          type="primary"
          class="!normal-case"
          @click="onClickToCheckoutOrder"
        >
          {{ $t('basket.to_checkout') }}
        </AppButton>

        <div
          v-if="sellingPoints?.length"
          class="flex flex-col gap-2 rounded bg-secondary-450 p-4 text-xs"
        >
          <p
            v-for="{ text } in sellingPoints"
            :key="text"
            class="flex justify-center gap-1 text-2xs text-gray-750"
          >
            <IconCheckmark
              class="h-4 w-4 rounded-full border border-gray-750"
            />
            {{ text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const basket = await useBasket()
const { isLoggedIn } = await useUser()
const { $i18n } = useNuxtApp()

const { trackBeginCheckout } = useTrackingEvents()

const totalCost = computed(() => basket.data.value?.cost.withTax)
const shippingCost = computed(() => 0)

const onClickToCheckoutOrder = async () => {
  trackBeginCheckout(
    basket.data.value?.items,
    BasketListingMetadata.NAME,
    BasketListingMetadata.ID,
  )
  const routeName = isLoggedIn.value
    ? routeList.checkout.name
    : routeList.signin.name

  await localizedNavigateTo({ name: routeName })
}

const sellingPoints = computed(() => [
  { icon: 'IconInvoice', text: $i18n.t('promises.pay_with_invoice') },
  { icon: 'IconDelivery', text: $i18n.t('promises.free_return_and_shipping') },
  { icon: 'IconReturn', text: $i18n.t('promises.return_policy') },
])
</script>
