<template>
  <Modal @close="emit('close')">
    <PageContent>
      <div class="flex flex-1 flex-row items-start gap-8">
        <ProductPromotionGiftImageGallery :images="images" />
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
                :disabled="product.isSoldOut"
                :title="product.isSoldOut ? $t('badge_labels.sold_out') : ''"
                :loading="basketIdle"
                class="text-sm !normal-case"
                @click="addItemToBasket()"
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
import {
  type ProductColor,
  type Variant,
  type Product,
  type Value,
  getAttributeValue,
  getFirstAttributeValue,
  getPrice,
  getVariantBySize,
  getProductSiblings,
} from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const emit = defineEmits(['close'])

const { $alert, $i18n } = useNuxtApp()

const { fetching: basketIdle, addItem: addBasketItem } = await useBasket()

const { trackAddToBasket } = useTrackingEvents()

const { openBasketFlyout } = useFlyouts()

const { isGreaterOrEquals } = useViewport()

const activeVariant = useState<Variant | undefined>(
  `active-gift-variant-${props.product.id}`,
)

const {
  brand,
  name: productName,
  variantWithLowestPrice,
} = useProductBaseInfo(props.product)

const lowestPriorPrice = computed(
  () =>
    activeVariant.value?.lowestPriorPrice ||
    variantWithLowestPrice.value?.lowestPriorPrice ||
    props.product?.lowestPriorPrice,
)

const price = computed(() =>
  activeVariant.value
    ? getPrice(activeVariant.value)
    : variantWithLowestPrice.value?.price,
)

const handleSelectedSize = (value: Value) => {
  if (props.product?.variants) {
    activeVariant.value = getVariantBySize(
      props.product?.variants,
      value,
      'size',
    )
  }
}

const size = computed(() => {
  return getFirstAttributeValue(activeVariant.value?.attributes, 'size')?.value
})

const hasOneSizeVariantOnly = computed(() => {
  const variants = props.product?.variants
  return (
    variants?.length === 1 &&
    getAttributeValue(variants[0].attributes, 'size') === ONE_SIZE_KEY
  )
})

const hasSpecial = computed(() => {
  return Boolean(!activeVariant.value && price.value?.appliedReductions.length)
})

const siblings = computed(() => {
  return getProductSiblings(props.product, 'color') || []
})

const addItemToBasket = async () => {
  if (hasOneSizeVariantOnly.value && props.product?.variants) {
    activeVariant.value = props.product.variants[0]
  }

  if (!activeVariant.value) {
    $alert.show($i18n.t('basket.notification.select_size'), 'CONFIRM')
    return
  }

  const productName = brand.value || $i18n.t('wishlist.product')

  try {
    await addBasketItem({
      variantId: activeVariant.value.id,
      quantity: 1,
    })

    openBasketFlyout()

    showAddToBasketToast(true, props.product)

    if (props.product) {
      trackAddToBasket({
        product: props.product,
        variant: activeVariant.value,
        index: 1,
      })
    }
  } catch {
    $alert.show(
      $i18n.t('basket.notification.add_to_basket_error', { productName }),
      'CONFIRM',
    )
  }
}

const images = computed(() => props.product.images)
</script>
