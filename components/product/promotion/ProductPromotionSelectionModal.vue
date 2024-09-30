<template>
  <ClientOnly>
    <SFSlideInFromBottomTransition>
      <SFModal
        :visible="isGiftSelectionShown"
        :appear-from-bottom="!isGreaterOrEqual('md')"
        disable-padding
        class="!rounded-t-xl max-sm:w-full md:!rounded-xl"
        @update:visible="(open) => open || close()"
      >
        <div class="flex">
          <div class="hidden p-3 md:block">
            <div class="relative overflow-hidden rounded-xl bg-gray-200">
              <ProductPromotionFreeGiftBadge
                :background-color-style="backgroundColorStyle"
                class="absolute left-0 top-0"
              />
              <ProductImage
                v-if="image"
                :image="image"
                :alt="name"
                sizes="700px"
                class="min-h-96 min-w-full"
              />
              <WishlistToggle
                class="absolute right-5 top-5"
                :product="product"
              />
            </div>
          </div>
          <div class="flex w-full flex-col justify-center p-6 md:p-8 md:py-14">
            <div class="mb-4 md:mb-auto">
              <span class="font-semi-bold-variable text-gray-900">
                {{ brand }}
              </span>
              <SFHeadline
                data-testid="pdp-product-name"
                tag="h3"
                class="mb-4 text-md !font-normal text-gray-600"
              >
                {{ name }}
              </SFHeadline>
              <ProductPrice
                v-if="price"
                :promotion="promotion"
                :price="price"
                size="xl"
                type="normal"
                :show-badges="false"
              />
            </div>
            <div
              class="relative mb-8 overflow-hidden rounded-xl bg-gray-200 md:hidden"
            >
              <ProductPromotionFreeGiftBadge
                :background-color-style="backgroundColorStyle"
                class="absolute left-0 top-0"
              />
              <ProductImage
                v-if="image"
                :image="image"
                :alt="name"
                sizes="500px"
                aspect-ratio="1/1"
              />
              <WishlistToggle
                class="absolute right-5 top-5"
                :product="product"
              />
            </div>
            <div class="flex flex-col gap-4">
              <div
                class="mt-7 text-md font-semi-bold-variable leading-[14px] text-gray-900"
              >
                {{ $t('pdp.size_heading') }}
              </div>
              <VariantPicker
                v-if="!hasOneSizeVariantOnly"
                v-model="activeVariant"
                :variants="product.variants ?? []"
                :promotion="promotion"
                class="md:mb-4"
              />

              <div class="flex justify-between gap-2">
                <SFButton
                  data-testid="add-item-to-basket-button"
                  type="accent"
                  :disabled="product.isSoldOut"
                  :title="product.isSoldOut ? $t('badge_labels.sold_out') : ''"
                  :loading="basketIdle"
                  class="w-full justify-between !px-4"
                  @click="addItemToBasket(promotion?.id)"
                >
                  {{ $t('pdp.add_label') }}
                  <template #append-icon>
                    <div class="flex items-center">
                      <IconPlus class="size-6 text-white" />
                    </div>
                  </template>
                </SFButton>
                <SFButton
                  type="tertiary"
                  :to="getProductDetailRoute(product.id, name)"
                  class="!border-gray-300"
                  @click="selectItem(product)"
                >
                  {{ $t('pdp.details_label') }}
                </SFButton>
              </div>
            </div>
          </div>
        </div>
      </SFModal>
    </SFSlideInFromBottomTransition>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'
import ProductPrice from '../ProductPrice.vue'
import WishlistToggle from '../WishlistToggle.vue'
import ProductImage from '../ProductImage.vue'
import VariantPicker from '../VariantPicker.vue'
import ProductPromotionFreeGiftBadge from './gifts/ProductPromotionFreeGiftBadge.vue'
import {
  useDefaultBreakpoints,
  usePageState,
  useProductBaseInfo,
  usePromotionGiftSelection,
  useRouteHelpers,
  useTrackingEvents,
} from '~/composables'
import { useRoute } from '#app/composables/router'
import { ClientOnly } from '#components'
import {
  SFButton,
  SFHeadline,
  SFSlideInFromBottomTransition,
  SFModal,
} from '#storefront-ui/components'

const props = defineProps<{
  product: Product
  promotion: Promotion
  backgroundColorStyle: { backgroundColor?: string }
}>()

const { getProductDetailRoute } = useRouteHelpers()
const { isGreaterOrEqual } = useDefaultBreakpoints()
const { trackSelectItem } = useTrackingEvents()
const route = useRoute()
const { pageState } = usePageState()

const {
  basketIdle,
  activeVariant,
  price,
  hasOneSizeVariantOnly,
  addItemToBasket,
  toggleGiftSelection,
  isGiftSelectionShown,
} = usePromotionGiftSelection(props.product)

const { name, brand, image } = useProductBaseInfo(props.product)

const selectItem = (product: Product) => {
  trackSelectItem({
    product,
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: route.params.id?.toString() || '',
    },
  })
}

const close = () => {
  activeVariant.value = undefined
  toggleGiftSelection()
}
</script>
