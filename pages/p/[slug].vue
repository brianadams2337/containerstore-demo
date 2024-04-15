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
                size="xl"
                class="!leading-snug"
                data-test-id="pdp-product-name"
                tag="h1"
              >
                {{ productName }}
              </Headline>

              <FadeInTransition>
                <PromotionHurryToSaveBanners
                  v-if="areHurryToSaveBannersShown"
                  :product="product"
                  class="mt-2 w-full xs:hidden md:flex"
                />
                <ProductPromotionGiftConditionBanner
                  v-else-if="!areGiftConditionsMet && isGiftAddedToBasket"
                  :product="product"
                  class="mt-2"
                />
                <ProductPromotionBanners
                  v-else
                  :product="product"
                  class="mt-2 xs:hidden md:flex"
                />
              </FadeInTransition>

              <div class="flex flex-col items-end">
                <div class="flex gap-2 xs:flex-col-reverse md:flex-col">
                  <ProductPromotionBadges
                    :product="product"
                    is-priority-label-shown
                    class="items-end md:hidden"
                  />
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
                  v-bind="{ product, lowestPriorPrice, price }"
                  type="normal"
                  :show-automatic-discount="!isBuyXGetYPrioritized"
                  :show-price-from="hasSpecial"
                  :show-price-reduction-badge="hasSpecial"
                  show-tax-info
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
                      v-if="item.colors.length"
                      :is-active="item.id === product.id"
                      :size="Size.LG"
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

            <AddOnsSelector
              v-if="availableAddOns.length"
              class="mt-8"
              :add-on-variant-ids="availableAddOns"
              :class="{ hidden: !activeVariant }"
              @click:service-selection="onAddOnSelected"
            />

            <StoreVariantAvailability
              v-if="activeVariant?.id"
              :selected-store-id="selectedStoreId"
              :variant-id="activeVariant.id"
            />

            <div class="mt-4 flex h-12">
              <ClientOnly>
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

                <WishlistToggle
                  class="ml-2 box-border h-full border border-gray-350 !px-2"
                  :product="product"
                />
              </ClientOnly>
            </div>

            <FadeInTransition>
              <ProductPromotionGifts
                v-if="isBuyXGetYPrioritized && !isGiftAddedToBasket"
                :product="product"
                class="mt-6"
              />
            </FadeInTransition>

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
        <ProductSubscription
          v-if="isProductSubscriptionEligible(product)"
          :product="product"
          :variant="activeVariant"
          @add-item-to-basket="addItemToBasket($event)"
        />
      </div>
    </div>
    <div class="w-full">
      <ProductDetails :product="product" />
    </div>
    <StoreLocatorSlideIn
      v-if="activeVariant?.id"
      v-model:selectedStoreId="selectedStoreId"
      :variant-id="activeVariant.id"
    />
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
  productId,
} = await useProductDetails()

const { addItemToBasket, basketIdle } = await useProductDetailsBasketActions()

const {
  isBuyXGetYPrioritized,
  areHurryToSaveBannersShown,
  isGiftAddedToBasket,
  areGiftConditionsMet,
} = await useProductPromotions(product)

const {
  sliderProducts,
  fetchingCombineWithProducts,
  trackRecommendationClick,
} = await useProductRecommendations()

const route = useRoute()
const { $i18n, $config } = useNuxtApp()
const { getProductDetailRoute } = useRouteHelpers()

const { setPageState } = usePageState()

const favoriteStoreId = useFavoriteStore()
const selectedStoreId = ref<number | undefined>(
  favoriteStoreId.value ?? undefined,
)

const { availableAddOns, onAddOnSelected } = useProductDetailsAddOns(
  productId.value,
  product,
)

const { state: zoomGallery, toggle: toggleZoomGallery } =
  useZoomGalleryActions()

const { trackViewItemList, trackViewItem } = useTrackingEvents()

const trackViewListing = ({ items }: { row: number; items: Product[] }) => {
  trackViewItemList({ items, listingMetaData })
}

onMounted(async () => {
  if (!product.value) {
    return
  }
  setPageState('typeId', String(product.value.id))
  await _sleep(1000)
  trackViewItem({ product: product.value })
})

activeVariant.value = hasOneSizeVariantOnly.value
  ? product.value?.variants?.[0]
  : undefined

const metaDescription = computed(() =>
  $i18n.t('pdp.seo.description', { productName: productName.value }),
)

const currentShop = useCurrentShop()
const { formatCurrency } = useFormatHelpers()

const sanitizedCanonicalURL = sanitizeCanonical(
  `${$config.public.baseUrl}${route.fullPath}`,
)

useJsonld(() =>
  generateProductSchema({
    price: formatCurrency(price.value?.withTax || 0, { style: 'decimal' }),
    productName: productName.value || '',
    brandName: brand.value || '',
    url: sanitizedCanonicalURL,
    isInStock: product.value?.variants?.some(isInStock),
    images: images.value,
    priceCurrency: currentShop.value?.currency,
  }),
)

useServerSeoMeta({ robots: 'index,follow' })

useHead(() => {
  if (!product.value) {
    return {}
  }
  return {
    title: `${productName.value} ${$i18n.t('pdp.seo.buy_online')}`,
    meta: [{ name: 'description', content: metaDescription.value }],
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
definePageMeta({ pageType: 'pdp' })
</script>
