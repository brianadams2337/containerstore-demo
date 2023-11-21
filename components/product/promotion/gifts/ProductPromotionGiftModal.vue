<template>
  <Modal @close="close">
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
                  :size="isGreaterOrEquals('md') ? '2xl' : 'xl'"
                  class="!leading-snug"
                  data-test-id="pdp-product-name"
                  tag="h1"
                >
                  {{ productName }}
                </Headline>
                <div class="flex flex-col">
                  <ProductPrice
                    v-if="price"
                    :product="product"
                    size="xl"
                    class="mt-3"
                    :type="isGreaterOrEquals('md') ? 'normal' : 'loud'"
                    :price="price"
                    :lowest-prior-price="lowestPriorPrice"
                    :applied-reductions="price?.appliedReductions"
                    show-tax-info
                    :show-price-from="hasSpecial"
                    :show-price-reduction-badge="hasSpecial"
                  />
                </div>
              </div>
            </div>
            <div class="w-full">
              <ProductDetailGroup class="mt-6">
                <ProductSiblingPicker :items="siblings" with-values>
                  <template #item="{ item }">
                    <DefaultLink
                      raw
                      class="flex items-center justify-center"
                      :to="getProductDetailRoute(product, item.id)"
                    >
                      <ColorChip
                        :is-active="item.id === product.id"
                        :size="isGreaterOrEquals('md') ? Size.LG : Size.XL"
                        :color="item.colors[0] as ProductColor"
                      />
                    </DefaultLink>
                  </template>
                </ProductSiblingPicker>
              </ProductDetailGroup>

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
                @click="addToBasket"
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
import type { ProductColor, Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const emit = defineEmits(['close'])

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
  siblings,
} = await usePromotionGift(props.product)

const { isGreaterOrEquals } = useViewport()

const close = () => emit('close')

const addToBasket = async () => {
  await addItemToBasket()
  close()
}
</script>
