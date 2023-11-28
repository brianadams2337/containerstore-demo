<template>
  <Modal v-if="isGiftSelectionShown" @close="close">
    <PageContent>
      <div class="flex flex-1 flex-row items-start gap-8">
        <ProductPromotionGiftImageGallery :images="images" class="w-1/2" />
        <div class="mt-5 w-1/2">
          <div class="w-full bg-white">
            <div class="my-2 md:mt-1">
              <div
                class="max-w-xs text-xs font-semibold text-secondary"
                data-test-id="pdp-product-brand"
              >
                {{ brand }}
              </div>
              <div class="flex items-start justify-between md:flex-col">
                <Headline
                  size="2xl"
                  class="!leading-snug"
                  data-test-id="pdp-product-name"
                  tag="h1"
                >
                  {{ productName }}
                </Headline>
                <div class="flex flex-col">
                  <ProductPrice
                    v-if="price"
                    v-bind="{ product, price, lowestPriorPrice }"
                    :applied-reductions="price?.appliedReductions"
                    :show-price-from="hasSpecial"
                    :show-price-reduction-badge="hasSpecial"
                    size="xl"
                    type="normal"
                    show-tax-info
                    class="mt-3"
                  />
                </div>
              </div>
            </div>
            <div class="w-full">
              <ProductSizePicker
                v-if="!hasOneSizeVariantOnly"
                :id="product.id"
                :value="size"
                :variants="product.variants ?? []"
                class="my-8 mr-2"
                @select-size="handleSelectedSize"
              />

              <AppButton
                data-test-id="add-item-to-basket-button"
                is-full-width
                type="primary"
                :disabled="product.isSoldOut || !activeVariant"
                :title="product.isSoldOut ? $t('badge_labels.sold_out') : ''"
                :loading="basketIdle"
                class="text-sm !normal-case"
                @click="addItemToBasket(promotion.id)"
              >
                {{ $t('pdp.add_label') }}
              </AppButton>
              <div class="mt-4 flex justify-end">
                <AppButton
                  type="ghost"
                  no-padding
                  size="xs"
                  :to="getProductDetailRoute(product)"
                  class="font-semibold"
                >
                  {{ $t('pdp.details_label') }}
                  <template #append-icon="{ _class }">
                    <IconForward :class="_class" />
                  </template>
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  </Modal>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product; promotion: Promotion }>()

const {
  basketIdle,
  lowestPriorPrice,
  activeVariant,
  price,
  productName,
  handleSelectedSize,
  size,
  brand,
  hasOneSizeVariantOnly,
  addItemToBasket,
  hasSpecial,
  images,
  toggleGiftSelection,
  isGiftSelectionShown,
} = await usePromotionGiftSelection(props.product)

const close = () => {
  activeVariant.value = null
  toggleGiftSelection()
}
</script>
