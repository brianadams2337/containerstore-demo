<template>
  <ProductDetailSkeleton v-if="fetching" />
  <PageContent v-else-if="product">
    <GoBackLink use-window-history class="ml-1 mt-4 md:ml-4 md:mt-7" />
    <div class="flex flex-1 flex-col items-start md:flex-row md:gap-3">
      <ProductImageGallery
        :product="product"
        @click:image="toggleZoomGallery(true, $event)"
      />
      <ZoomGallery
        v-if="zoomGallery.display"
        :images="product.images"
        :active-index="zoomGallery.index"
        @click:close-zoom-gallery="toggleZoomGallery(false)"
      />
      <div
        class="sticky right-0 top-0 mt-5 w-full md:w-1/2 md:pl-4 xl:w-1/3 xl:pl-6"
      >
        <div class="w-full bg-white">
          <div class="my-2 md:mt-1">
            <div class="mb-2">
              <ProductDetailBreadcrumbs :links="breadcrumbs" />
            </div>
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
              <ProductAutomaticDiscountBanner
                :product="product"
                class="mt-2 xs:hidden md:flex"
              />
              <div class="flex flex-col">
                <div class="flex gap-2 xs:flex-col-reverse md:flex-col">
                  <ProductPromotionBadge :product="product" class="md:hidden" />
                  <ProductBadge
                    v-if="product.isSoldOut"
                    :badge-label="
                      getBadgeLabel({ isSoldOut: product.isSoldOut })
                    "
                  />
                </div>

                <ProductPrice
                  v-if="price"
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

            <div class="mt-8 flex">
              <ProductSizePicker
                v-if="!hasOneSizeVariantOnly"
                :id="product.id"
                :value="
                  getFirstAttributeValue(activeVariant?.attributes, 'size')
                    ?.value
                "
                :variants="product.variants ?? []"
                class="mr-2"
                @select-size="handleSelectedSize"
              />

              <Dropdown
                v-if="!availableAddOns.length && !hasOneSizeVariantOnly"
                :model-value="quantity"
                :items="availableQuantity"
                :disabled="!activeVariant"
                is-large
                class="h-full"
                @update:model-value="quantity = $event"
              />
            </div>

            <!-- ComputedAddOns == [] -->
            <AddOnsSelector
              v-if="availableAddOns.length"
              class="mt-8"
              :add-on-variant-ids="availableAddOns"
              :class="{ hidden: !activeVariant }"
              @click:service-selection="onAddOnSelected"
            />
            <div class="mt-4 flex h-12">
              <!-- add to basket -->
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
              <ClientOnly>
                <WishlistToggle
                  class="ml-2 box-border h-full border border-gray-350 !px-2"
                  :product="product"
                />
              </ClientOnly>
            </div>

            <ProductPromotionGifts
              v-if="isBuyXGetY"
              :product="product"
              class="mt-6"
            />

            <div class="mt-3">
              <ProductDetailGroup
                v-if="sliderProducts.length"
                data-test-id="combine-with-slider"
              >
                <template #headline>
                  {{ $t('global.product_recommendation') }}
                </template>
                <ProductRecommendations
                  size="4xs"
                  :products="sliderProducts"
                  :loading="fetchingCombineWithProducts"
                  @intersect:column="trackViewListing"
                  @click:recommendation="trackRecommendationClick"
                />
              </ProductDetailGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full">
      <ProductDetails :product="product" />
    </div>
  </PageContent>
</template>

<script setup lang="ts">
import {
  type Product,
  type ProductColor,
  getFirstAttributeValue,
  getBadgeLabel,
  isInStock,
} from '@scayle/storefront-nuxt'

const route = useRoute()
const store = useStore()
const { $i18n, $config } = useNuxtApp()

const {
  product,
  activeVariant,
  quantity,
  availableQuantity,
  hasOneSizeVariantOnly,
  brand,
  name: productName,
  images,
  breadcrumbs,
  siblings,
  hasSpecial,
  price,
  handleSelectedSize,
  lowestPriorPrice,
  fetching,
  listingMetaData,
} = await useProductDetails()

const { addItemToBasket, basketIdle } = await useProductDetailsBasketActions()

const { isBuyXGetY } = await useProductPromotion(product)

const {
  sliderProducts,
  fetchingCombineWithProducts,
  trackRecommendationClick,
} = await useProductRecommendations()

const { availableAddOns, onAddOnSelected } = useProductDetailsAddOns(product)

const { state: zoomGallery, toggle: toggleZoomGallery } =
  useZoomGalleryActions()

const { trackViewItemList, trackViewItem } = useTrackingEvents()

const { isGreaterOrEquals } = useViewport()

const trackViewListing = ({ items }: { row: number; items: Product[] }) => {
  trackViewItemList({ items, listingMetaData })
}

onMounted(async () => {
  store.value.pageTypeId = String(product.value.id)
  if (!product.value) {
    return
  }
  await useSleep(1000)
  trackViewItem({ product: product.value })
})

definePageMeta({ pageType: 'pdp' })

const metaDescription = computed(() =>
  $i18n.t('pdp.seo.description', { productName: productName.value }),
)

useSeoMeta(() => ({
  robots: 'index,follow',
  title: `${productName.value} ${$i18n.t('pdp.seo.buy_online')}`,
  description: metaDescription.value,
}))

const currentShop = useCurrentShop()

const sanitizedCanonicalURL = sanitizeCanonical(
  `${$config.public.baseUrl}${route.fullPath}`,
)

useJsonld(() =>
  generateProductSchema({
    price: formatPrice(price.value?.withTax || 0),
    productName: productName.value || '',
    brandName: brand.value || '',
    url: sanitizedCanonicalURL,
    isInStock: product.value?.variants?.some(isInStock),
    images: images.value,
    priceCurrency: currentShop.value?.currency,
  }),
)

useHead(() => {
  if (!product.value) {
    return {}
  }
  return {
    link: [
      {
        rel: 'canonical',
        key: 'canonical',
        href: sanitizeCanonical(
          `${$config.baseUrl}${getProductDetailRoute(product?.value)}`,
        ),
      },
    ],
  }
})

defineOptions({ name: 'ProductDetailPage' })
</script>
