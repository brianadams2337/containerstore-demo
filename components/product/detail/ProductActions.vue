<template>
  <div
    v-if="product.isSoldOut"
    class="rounded-xl bg-red-100 p-4 text-md text-red max-md:mx-5"
  >
    {{ $t('pdp.sold_out') }}
  </div>
  <div v-else class="max-md:px-5">
    <SiblingSelection :product="product" />

    <div
      class="mt-7 text-md font-semi-bold-variable leading-[14px] text-gray-900"
    >
      {{ $t('pdp.size_heading') }}
    </div>
    <div class="my-3 mt-4 flex h-12 items-center space-x-4">
      <VariantPicker
        ref="variantPicker"
        v-model="activeVariant"
        v-model:visible="isVariantListVisible"
        :variants="variants"
        :promotion="promotion"
        :has-one-variant-only="hasOneVariantOnly"
        class="grow"
      />
      <QuantityInput v-model="quantity" :max-quantity="maxQuantity" />
    </div>
  </div>
  <div class="flex gap-3 max-md:hidden">
    <SFButton
      variant="accent"
      size="xl"
      class="grow justify-between"
      data-testid="add-item-to-basket-button"
      :disabled="isSoldOutOrOutOfStock"
      @click="addItemToBasket(basketItem)"
    >
      <template v-if="!isSoldOutOrOutOfStock">
        {{ $t('basket.add_to_basket') }}
      </template>
      <template v-else>
        {{ $t('global.sold_out') }}
      </template>
      <div class="flex items-center">
        <IconPlus
          class="size-4 scale-x-0 text-white transition-transform duration-150 group-hover:scale-100"
        />
        <IconBasket class="size-5 text-white" />
      </div>
    </SFButton>
    <WishlistToggle
      :product="product"
      class="!size-13 !bg-gray-100 hover:!scale-100 hover:!bg-gray-200 hover:!text-black"
    />
  </div>
  <ProductSubscription
    v-if="isProductSubscriptionEligible(product)"
    :product="product"
    :variant="activeVariant"
    class="mt-4"
    @add-item-to-basket="addItemToBasket($event)"
  />
  <Teleport to="#teleports">
    <FloatingContainer
      class="!bottom-6 z-50 flex w-full items-center gap-x-3 px-3 md:hidden"
    >
      <SFButton
        variant="accent"
        size="xl"
        class="grow"
        data-testid="add-to-basket-button-mobile"
        :disabled="isSoldOutOrOutOfStock"
        @click="addItemToBasket(basketItem)"
      >
        <div class="flex w-full justify-between">
          <template v-if="!isSoldOutOrOutOfStock">
            {{ $t('basket.add_to_basket') }}
          </template>
          <template v-else>
            {{ $t('global.sold_out') }}
          </template>

          <div class="flex items-center">
            <IconPlus
              class="size-4 scale-x-0 text-white transition-transform duration-150 group-hover:scale-100"
            />
            <IconBasket class="size-5 text-white" />
          </div>
        </div>
      </SFButton>
      <ScrollToTopButton />
    </FloatingContainer>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product, Variant } from '@scayle/storefront-nuxt'
import { useElementVisibility } from '@vueuse/core'
import SiblingSelection from '../SiblingSelection.vue'
import VariantPicker from '../VariantPicker.vue'
import WishlistToggle from '../WishlistToggle.vue'
import QuantityInput from './QuantityInput.vue'
import FloatingContainer from '~/components/FloatingContainer.vue'
import ScrollToTopButton from '~/components/ScrollToTopButton.vue'
import { isProductSubscriptionEligible } from '#storefront-subscription/helpers/subscription'
import { ProductSubscription } from '#storefront-subscription/components'
import { SFButton } from '#storefront-ui/components'
import { isAutomaticDiscountType } from '~/utils/promotion'
import {
  useProductBaseInfo,
  useBasketActions,
  useTrackingEvents,
  type AddToBasketItem,
} from '~/composables'
import type { Promotion } from '~/types/promotion'

type Props = {
  product: Product
  promotion?: Promotion
}
const props = defineProps<Props>()

const { hasOneVariantOnly, variants, name } = useProductBaseInfo(props.product)

const activeVariant = defineModel<Variant>('activeVariant')

const quantity = ref(1)

// Note: The basket does not allow a quantity > 50, therefore we limit it to prevent errors
const maxQuantity = computed(() =>
  Math.max(Math.min(activeVariant.value?.stock.quantity ?? 1, 10), 0),
)

watch(activeVariant, () => {
  quantity.value = 1
})

const basketItem = computed<AddToBasketItem | undefined>(() => {
  if (!activeVariant.value) {
    return
  }
  // NOTE: For Buy x Get Y promotions, the promotion Id needs to be added on the Y Item (Gift)
  const promotionId = isAutomaticDiscountType(props.promotion)
    ? props.promotion?.id
    : undefined
  return {
    productName: name.value,
    variantId: activeVariant.value?.id,
    quantity: quantity.value,
    promotionId,
  }
})

// Add to basket
const isVariantListVisible = ref(false)
const variantPicker = ref()
const { addItem } = useBasketActions()
const { trackAddToBasket } = useTrackingEvents()

const isVariantPickerVisible = useElementVisibility(variantPicker, {
  threshold: 1,
})

const isSoldOutOrOutOfStock = computed(
  () =>
    (activeVariant.value && activeVariant.value?.stock.quantity <= 0) ||
    props.product.isSoldOut,
)

const addItemToBasket = async (item: AddToBasketItem | undefined) => {
  if (!activeVariant.value) {
    if (!isVariantPickerVisible.value) {
      variantPicker.value?.$el.scrollIntoView({ block: 'center' })
    }
    isVariantListVisible.value = true
    return
  }
  if (!item) {
    return
  }
  await addItem(item)
  trackAddToBasket({
    product: props.product,
    variant: activeVariant.value,
    quantity: item.quantity,
  })
}
</script>
