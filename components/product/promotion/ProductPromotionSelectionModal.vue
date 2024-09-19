<template>
  <SFModal
    :visible="isGiftSelectionShown"
    hide-close-button
    @update:visible="(open) => open || close()"
  >
    <PageContent>
      <div class="flex flex-1 flex-row items-start gap-8">
        <ProductPromotionGiftImageGallery :images="images" class="w-1/2" />
        <div class="mt-5 w-1/2">
          <div class="w-full bg-white">
            <div class="my-2 md:mt-1">
              <div
                class="max-w-xs text-xs font-semibold text-secondary"
                data-testid="pdp-product-brand"
              >
                {{ brand }}
              </div>
              <div class="flex items-start justify-between md:flex-col">
                <SFHeadline
                  size="2xl"
                  class="!leading-snug"
                  data-testid="pdp-product-name"
                  tag="h1"
                >
                  {{ productName }}
                </SFHeadline>
                <div class="flex flex-col">
                  <ProductPrice
                    v-if="price"
                    :promotion="promotion"
                    :price="
                      areConditionsMet
                        ? createCustomPrice(price, { withTax: 0 as CentAmount })
                        : price
                    "
                    size="xl"
                    type="normal"
                    show-tax-info
                    class="mt-3"
                  >
                    <template #default="{ classes, totalPrice }">
                      <p
                        class="inline-flex items-end gap-1 leading-snug"
                        :class="classes"
                        data-testid="price"
                      >
                        <span
                          :class="{
                            'inline rounded p-1 text-base font-semibold leading-5':
                              areConditionsMet,
                          }"
                          :style="styles"
                        >
                          {{ totalPrice }}
                        </span>
                      </p>
                    </template>
                  </ProductPrice>
                </div>
              </div>
            </div>
            <div class="w-full">
              <VariantPicker
                v-if="!hasOneSizeVariantOnly"
                v-model="activeVariant"
                :variants="product.variants ?? []"
                :promotion="promotion"
                class="my-8 mr-2"
              />

              <SFButton
                data-testid="add-item-to-basket-button"
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
                  type="raw"
                  no-padding
                  size="xs"
                  :to="getProductDetailRoute(product.id, productName)"
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
import { computed } from 'vue'
import {
  type Product,
  getFirstAttributeValue,
  type CentAmount,
} from '@scayle/storefront-nuxt'
import { getBackgroundColorStyle, getTextColorStyle } from '~/utils/promotion'
import { AlphaColorMap } from '~/constants/color'
import { useBasket } from '#storefront/composables'
import { usePromotionGiftSelection, useRouteHelpers } from '~/composables'
import { createCustomPrice } from '~/utils'

const props = defineProps<{
  product: Product
  promotedProduct: Product
  promotion: Promotion
}>()

const { getProductDetailRoute } = useRouteHelpers()

const {
  basketIdle,
  activeVariant,
  price,
  productName,
  brand,
  hasOneSizeVariantOnly,
  addItemToBasket,
  images,
  toggleGiftSelection,
  isGiftSelectionShown,
} = usePromotionGiftSelection(props.product)

const { data: basketData } = useBasket()

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
  activeVariant.value = undefined
  toggleGiftSelection()
}
</script>
