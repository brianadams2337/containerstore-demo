<template>
  <Teleport to="body">
    <FadeInFromBottomTransition>
      <div
        v-if="isGiftSelectionShown"
        ref="sizeSelection"
        class="fixed bottom-0 z-[100] w-full rounded-t-xl bg-white px-4 py-2"
      >
        <div class="relative mt-2 flex items-center justify-center">
          <Headline size="base" is-bold>
            {{ $t('pdp.promotion.select_size_label') }}
          </Headline>
          <AppButton
            type="raw"
            size="xs"
            fab
            no-padding
            class="absolute right-0 top-0 !p-1"
            @click="toggleGiftSelection()"
          >
            <template #icon="{ _class }">
              <IconCloseBold :class="_class" class="text-black" />
            </template>
          </AppButton>
        </div>
        <div
          class="mt-4 border border-x-transparent border-y-secondary-700 py-4"
        >
          <RadioItem
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
          <AppButton type="secondary" class="w-1/3" @click="cancel">
            {{ $t('pdp.promotion.select_size_cancel') }}
          </AppButton>
          <AppButton
            :disabled="!activeVariant"
            is-full-width
            @click="addItemToBasket(promotion.id)"
          >
            {{ $t('pdp.promotion.select_size_add_label') }}
          </AppButton>
        </div>
      </div>
    </FadeInFromBottomTransition>
  </Teleport>
  <Overlay v-if="isGiftSelectionShown" />
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product; promotion: Promotion }>()

const {
  handleSelectedSize,
  activeVariant,
  addItemToBasket,
  toggleGiftSelection,
  isGiftSelectionShown,
} = await usePromotionGiftSelection(props.product)

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

const onSelectSize = (variantId: number) => {
  const value = variantSizes.value.find((it) => it.variantId === variantId)
  value && handleSelectedSize(value)
}
</script>
