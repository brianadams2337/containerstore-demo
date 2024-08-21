<template>
  <Teleport to="body">
    <SFFadeInFromBottomTransition>
      <div
        v-if="isGiftSelectionShown"
        ref="sizeSelection"
        class="fixed bottom-0 z-100 w-full rounded-t-xl bg-white px-4 py-2"
      >
        <div class="relative mt-2 flex items-center justify-center">
          <SFHeadline size="base" is-bold>
            {{ $t('pdp.promotion.select_size_label') }}
          </SFHeadline>
          <SFButton
            type="raw"
            size="xs"
            fab
            no-padding
            class="absolute right-0 top-0 !p-1"
            @click="toggleGiftSelection()"
          >
            <template #icon="{ _class }">
              <IconClose :class="_class" class="text-black" />
            </template>
          </SFButton>
        </div>
        <div
          class="mt-4 border border-x-transparent border-y-secondary-700 py-4"
        >
          <SFRadioItem
            v-for="size in sizes"
            :key="size.value"
            :model-value="activeVariant?.id"
            v-bind="size"
            :class="activeVariant?.id === size.value && 'bg-secondary-450'"
            class="rounded-md p-4"
            @update:model-value="onSelectSize"
          />
        </div>
        <div class="flex items-center justify-center gap-4 py-4">
          <SFButton type="secondary" class="w-1/3" @click="cancel">
            {{ $t('pdp.promotion.select_size_cancel') }}
          </SFButton>
          <SFButton
            :disabled="!activeVariant"
            is-full-width
            @click="addItemToBasket(promotion.id)"
          >
            {{ $t('pdp.promotion.select_size_add_label') }}
          </SFButton>
        </div>
      </div>
    </SFFadeInFromBottomTransition>
  </Teleport>
  <SFOverlay v-if="isGiftSelectionShown" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { Product } from '@scayle/storefront-nuxt'
import { usePromotionGiftSelection } from '~/composables'
import { getVariantSizes } from '~/utils/sizes'

const props = defineProps<{
  product: Product
  promotedProduct: Product
  promotion: Promotion
}>()

const {
  handleSelectedSize,
  activeVariant,
  addItemToBasket,
  toggleGiftSelection,
  isGiftSelectionShown,
} = usePromotionGiftSelection(props.product)

const sizeSelection = ref()

const cancel = () => {
  activeVariant.value = null
  toggleGiftSelection()
}

onClickOutside(sizeSelection, () => toggleGiftSelection())

const variantSizes = computed(() => getVariantSizes(props.product.variants))
const sizes = computed(() =>
  variantSizes.value.map((it) => ({
    value: it.variantId,
    label: it.label,
  })),
)

const onSelectSize = (variantId: string | number | undefined) => {
  if (!variantId) {
    return
  }

  const selectedSize = variantSizes.value.find(
    (it) => it.variantId === variantId,
  )

  if (selectedSize) {
    handleSelectedSize(selectedSize)
  }
}
</script>
