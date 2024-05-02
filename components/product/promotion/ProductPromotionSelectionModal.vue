<template>
  <SFModal v-if="isGiftSelectionShown" @close="close">
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
                <SFHeadline
                  size="2xl"
                  class="!leading-snug"
                  data-test-id="pdp-product-name"
                  tag="h1"
                >
                  {{ productName }}
                </SFHeadline>
                <div class="flex flex-col">
                  <ProductPrice
                    v-if="price"
                    v-bind="{ product, price, lowestPriorPrice }"
                    :is-free="areConditionsMet"
                    size="xl"
                    type="normal"
                    show-tax-info
                    class="mt-3"
                  >
                    <template
                      #default="{
                        price: productPriceValue,
                        classes,
                        totalReductions,
                        isAutomaticDiscountPriceApplicable,
                        isFree,
                        totalPrice,
                      }"
                    >
                      <p
                        class="leading-snug inline-flex gap-1 items-end"
                        :class="classes"
                        data-test-id="price"
                      >
                        <span
                          :class="{
                            'inline rounded p-1 text-base leading-5 font-semibold':
                              areConditionsMet,
                          }"
                          :style="styles"
                        >
                          {{ totalPrice }}
                        </span>
                        <span
                          v-if="
                            totalReductions.absoluteWithTax ||
                            isAutomaticDiscountPriceApplicable ||
                            isFree
                          "
                          class="text-sm font-medium text-primary leading-5 p-1 line-through"
                          data-test-id="initialProductPrice"
                        >
                          {{
                            formatCurrency(
                              productPriceValue.withTax +
                                totalReductions.absoluteWithTax,
                            )
                          }}
                        </span>
                      </p>
                    </template>
                  </ProductPrice>
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

              <SFButton
                data-test-id="add-item-to-basket-button"
                is-full-width
                type="primary"
                :disabled="product.isSoldOut || !activeVariant"
                :title="product.isSoldOut ? $t('badge_labels.sold_out') : ''"
                :loading="basketIdle"
                class="text-sm !normal-case"
                @click="addItemToBasket(promotion?.id)"
              >
                {{ $t('pdp.add_label') }}
              </SFButton>
              <div class="mt-4 flex justify-end">
                <SFButton
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
                </SFButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  </SFModal>
</template>

<script setup lang="ts">
import { type Product, getFirstAttributeValue } from '@scayle/storefront-nuxt'

const props = defineProps<{
  product: Product
  promotedProduct: Product
  promotion: Promotion
}>()

const { getProductDetailRoute } = useRouteHelpers()
const { formatCurrency } = useFormatHelpers()

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
  images,
  toggleGiftSelection,
  isGiftSelectionShown,
} = await usePromotionGiftSelection(props.product, props.promotedProduct)

const { data: basketData } = await useBasket()

const areConditionsMet = computed(() => {
  const basketItem = (basketData.value?.items ?? []).find((item) => {
    return (
      getFirstAttributeValue(item.product?.attributes, 'promotion')?.id ===
      getFirstAttributeValue(props.promotedProduct?.attributes, 'promotion')?.id
    )
  })
  const minQuantity = props.promotion.customData?.giftConditions?.minQuantity

  if (!basketItem || !minQuantity) {
    return false
  }

  return basketItem?.quantity >= minQuantity
})

const styles = computed(() => {
  if (areConditionsMet.value) {
    return {
      ...getBackgroundColorStyle(
        props.promotion.customData?.colorHex,
        AlphaColorMap.ALPHA_10,
      ),
      ...getTextColorStyle(
        props.promotion.customData.colorHex,
        AlphaColorMap.ALPHA_100,
      ),
    }
  }
  return null
})

const close = () => {
  activeVariant.value = null
  toggleGiftSelection()
}
</script>
