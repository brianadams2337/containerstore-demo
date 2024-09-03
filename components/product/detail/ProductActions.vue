<template>
  <div>
    <div
      v-if="product.isSoldOut"
      class="rounded-xl bg-red-100 p-4 text-md text-red"
    >
      {{ $t('pdp.sold_out') }}
    </div>
    <div v-else>
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
          :automatic-discount-promotion="promotion ?? null"
          :has-one-variant-only="hasOneVariantOnly"
          class="grow"
        />
        <IconClose class="size-4 text-gray-500 max-sm:hidden" />
        <QuantityInput v-model="quantity" :max-quantity="maxQuantity" />
      </div>
    </div>
    <div class="flex gap-3 max-md:hidden">
      <AddToBasketButton
        :disabled="activeVariant && activeVariant?.stock.quantity <= 0"
        @add-to-basket="addItemToBasket()"
      >
        <template
          v-if="!activeVariant || activeVariant?.stock.quantity > 0"
          #default
        >
          {{ $t('basket.add_to_basket') }}
          <span v-if="!activeVariant" class="font-normal max-md:hidden">
            {{ $t('pdp.select_size') }}
          </span>
        </template>
        <template
          v-else-if="activeVariant && activeVariant?.stock.quantity <= 0"
          #default
        >
          {{ $t('global.sold_out') }}
        </template>
      </AddToBasketButton>
      <WishlistToggle
        :product="product"
        class="!size-[52px] !bg-gray-100 hover:!scale-100 hover:!bg-gray-200 hover:!text-black"
      />
    </div>
    <Teleport to="body">
      <FloatingContainer
        class="!bottom-6 z-50 flex w-full items-center gap-x-3 px-3 md:hidden"
      >
        <AddToBasketButton
          :disabled="activeVariant && activeVariant?.stock.quantity <= 0"
          @add-to-basket="addItemToBasket"
        >
          <template
            v-if="!activeVariant || activeVariant?.stock.quantity > 0"
            #default
          >
            {{ $t('basket.add_to_basket') }}
            <span v-if="!activeVariant" class="font-normal max-md:hidden">
              {{ $t('pdp.select_size') }}
            </span>
          </template>
          <template
            v-else-if="activeVariant && activeVariant?.stock.quantity <= 0"
            #default
          >
            {{ $t('global.sold_out') }}
          </template>
        </AddToBasketButton>
        <ScrollToTopButton class="!size-[52px]" />
      </FloatingContainer>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { defineModel, computed, ref } from 'vue'
import type { Product, Variant } from '@scayle/storefront-nuxt'
import { useProductBaseInfo } from '~/composables/useProductBaseInfo'
import type VariantPicker from '~/components/product/VariantPicker.vue'
import { useAddToBasket } from '~/composables/useAddToBasket'
import { useElementVisibility } from '#imports'

type Props = {
  product: Product
  promotion?: Promotion
}
const props = defineProps<Props>()

const { hasOneVariantOnly, variants, name } = useProductBaseInfo(props.product)

const activeVariant = defineModel<Variant>('activeVariant')

const quantity = ref(1)
const maxQuantity = computed(() =>
  Math.max(Math.min(activeVariant.value?.stock.quantity ?? 1, 9), 0),
)

// Add to basket
const isVariantListVisible = ref(false)
const variantPicker = ref()
const { addItem } = useAddToBasket()

const isVariantPickerVisible = useElementVisibility(variantPicker, {
  threshold: 1,
})

const addItemToBasket = async () => {
  if (!activeVariant.value) {
    if (!isVariantPickerVisible.value) {
      variantPicker.value?.$el.scrollIntoView({ block: 'center' })
    }
    isVariantListVisible.value = true
    return
  }
  addItem({
    productName: name.value,
    variantId: activeVariant.value?.id,
    quantity: quantity.value,
    promotionId: props.promotion?.id,
  })
}
</script>
