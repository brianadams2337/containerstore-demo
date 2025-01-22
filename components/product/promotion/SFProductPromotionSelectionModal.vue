<template>
  <ClientOnly>
    <SFSlideInFromBottomTransition>
      <SFModal
        :visible="isGiftSelectionShown"
        class="!rounded-t-xl !p-0 max-md:m-0 max-md:mt-auto max-md:max-h-[calc(100vh-40px)] max-md:w-full max-md:max-w-screen md:max-w-[800px] md:!rounded-xl"
        @update:visible="(open) => open || close()"
      >
        <div class="flex">
          <div class="hidden p-3 md:block">
            <div class="relative overflow-hidden rounded-xl bg-gray-200">
              <SFProductPromotionFreeGiftBadge
                :background-color-style="backgroundColorStyle"
                class="absolute left-0 top-0"
              />
              <ProductImage
                v-if="image"
                :image="image"
                :alt="alt"
                sizes="700px"
                class="min-h-96 min-w-full"
              />
              <SFWishlistToggle
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
              <SFProductPrice
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
              <SFProductPromotionFreeGiftBadge
                :background-color-style="backgroundColorStyle"
                class="absolute left-0 top-0"
              />
              <ProductImage
                v-if="image"
                :image="image"
                :alt="alt"
                sizes="500px"
                aspect-ratio="1/1"
              />
              <SFWishlistToggle
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
              <SFVariantPicker
                ref="variantPicker"
                v-model="activeVariant"
                v-model:visible="isVariantListVisible"
                :has-one-variant-only="hasOneVariantOnly"
                :variants="giftVariants"
                :promotion="promotion"
                class="md:mb-4"
              />

              <div class="flex justify-between gap-2">
                <SFButton
                  data-testid="add-item-to-basket-button"
                  variant="accent"
                  :disabled="product.isSoldOut"
                  :title="product.isSoldOut ? $t('badge_labels.sold_out') : ''"
                  :loading="status === 'pending'"
                  class="w-full justify-between !px-4"
                  @click="addToBasket"
                >
                  {{ $t('pdp.add_label') }}
                  <template #append-icon>
                    <div class="flex items-center">
                      <IconPlus class="size-6 text-white" />
                    </div>
                  </template>
                </SFButton>
                <SFButton
                  variant="tertiary"
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
import { ref } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import SFProductPrice from '../SFProductPrice.vue'
import SFWishlistToggle from '../SFWishlistToggle.vue'
import ProductImage from '../SFProductImage.vue'
import SFVariantPicker from '../SFVariantPicker.vue'
import SFProductPromotionFreeGiftBadge from './gifts/SFProductPromotionFreeGiftBadge.vue'
import {
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
import type { Promotion } from '~/types/promotion'

const props = defineProps<{
  product: Product
  promotion: Promotion
  backgroundColorStyle: { backgroundColor?: string }
}>()

const { getProductDetailRoute } = useRouteHelpers()
const { trackSelectItem } = useTrackingEvents()
const route = useRoute()
const { pageState } = usePageState()

const {
  status,
  activeVariant,
  giftVariants,
  price,
  addItemToBasket,
  toggleGiftSelection,
  isGiftSelectionShown,
} = usePromotionGiftSelection(props.product)

const { name, brand, image, hasOneVariantOnly, alt } = useProductBaseInfo(
  props.product,
)

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

const isVariantListVisible = ref(false)
const variantPicker = ref()
const isVariantPickerVisible = useElementVisibility(variantPicker, {
  threshold: 1,
})

const addToBasket = () => {
  if (!activeVariant.value) {
    if (!isVariantPickerVisible.value) {
      variantPicker.value?.$el.scrollIntoView({ block: 'center' })
    }
    isVariantListVisible.value = true
    return
  }

  addItemToBasket(props.promotion?.id)
}

const close = () => {
  if (!hasOneVariantOnly.value) {
    activeVariant.value = undefined
  }
  toggleGiftSelection()
}
</script>
