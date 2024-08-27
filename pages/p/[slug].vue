<template>
  <ProductDetailSkeleton v-if="fetching" />
  <PageContent v-else-if="product">
    <SFGoBackLink use-window-history class="ml-1 mt-4 md:ml-4 md:mt-7" />
    <div class="flex flex-1 flex-col items-start md:flex-row md:gap-3">
      <ProductImageGallery
        :product="product"
        @click:image="toggleZoomGallery(true, $event)"
      />
      <ZoomGallery :images="product.images" :active-index="zoomGalleryIndex" />
      <div
        class="sticky right-0 top-0 mt-5 w-full md:w-1/2 md:pl-4 xl:w-1/3 xl:pl-6"
      >
        <div class="w-full bg-white">
          <div class="my-2 md:mt-1">
            <div class="mb-2">
              <ProductDetailBreadcrumbs :breadcrumbs="breadcrumbs" />
            </div>
            <div
              class="max-w-xs text-xs font-semibold text-secondary"
              data-test-id="pdp-product-brand"
            >
              {{ brand }}
            </div>
            <div class="flex items-start justify-between md:flex-col">
              <SFHeadline
                size="xl"
                class="!leading-snug"
                data-test-id="pdp-product-name"
                tag="h1"
              >
                {{ productName }}
              </SFHeadline>

              <ProductPromotionBanners :product="product" />

              <div class="flex flex-col items-end">
                <div class="flex gap-2 xs:flex-col-reverse md:flex-col">
                  <ProductPromotionBadges
                    :product="product"
                    is-priority-label-shown
                    class="items-end md:hidden"
                    :is-full-width="false"
                  />
                  <ProductBadge
                    v-if="product.isSoldOut"
                    :text="$t('badge_labels.sold_out')"
                  />
                </div>

                <ProductPrice
                  v-if="price"
                  size="xl"
                  class="mt-3"
                  :product="product"
                  :lowest-prior-price="lowestPriorPrice"
                  :price="price"
                  type="normal"
                  :show-automatic-discount="!isBuyXGetYPrioritized"
                  :show-price-from="hasSpecial"
                  :show-price-reduction-badge="hasSpecial"
                  show-tax-info
                >
                  <template
                    #default="{
                      classes,
                      isAutomaticDiscountPriceApplicable,
                      isFree,
                      price: productPrice,
                      totalReductions,
                      totalPrice,
                      showPriceFrom,
                      styles,
                    }"
                  >
                    <p
                      class="flex items-end gap-1.5 leading-snug"
                      :class="classes"
                      data-test-id="price"
                    >
                      <span v-if="showPriceFrom">
                        {{ $t('price.starting_from') }}
                      </span>
                      <span
                        v-if="!isFree"
                        :class="{
                          'inline rounded p-1 text-base font-semibold leading-5':
                            isAutomaticDiscountPriceApplicable,
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
                        class="p-1 text-sm font-medium leading-5 text-primary line-through"
                        data-test-id="initialProductPrice"
                      >
                        {{
                          formatCurrency(
                            productPrice.withTax +
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
            <ProductDetailGroup class="mt-6">
              <ProductSiblingPicker :items="siblings" with-values>
                <template #item="{ item }">
                  <ProductColorChip
                    v-if="item.colors.length"
                    :to="getProductDetailRoute(product, item.id)"
                    :is-active="item.id === product.id"
                    :size="Size.LG"
                    :color="item.colors[0] as ProductColor"
                  />
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

              <SFDropdown
                v-if="!availableAddOns.length"
                :model-value="quantity"
                :items="availableQuantity"
                :disabled="!activeVariant"
                is-large
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

            <ProductBasketAndWishlistActions
              :product="product"
              :active-variant="activeVariant"
              :quantity="quantity"
              class="mt-4"
            />

            <ClientOnly>
              <template #fallback>
                <SFSkeletonLoader
                  type="custom"
                  class="mt-6 h-64 w-full rounded-md"
                />
              </template>
              <SFFadeInTransition>
                <ProductPromotionGifts
                  v-if="isBuyXGetYPrioritized && !isGiftAddedToBasket"
                  :product="product"
                  class="mt-6"
                />
              </SFFadeInTransition>
            </ClientOnly>

            <div v-if="combineWithProductIds.length > 0" class="mt-3">
              <ProductDetailGroup data-test-id="combine-with-slider">
                <template #headline>
                  {{ $t('global.product_recommendation') }}
                </template>
                <ProductRecommendations
                  size="4xs"
                  :combine-with-product-ids="combineWithProductIds"
                />
              </ProductDetailGroup>
            </div>
          </div>
        </div>
        <ProductSubscription
          v-if="isProductSubscriptionEligible(product)"
          :product="product"
          :variant="activeVariant"
          class="mt-4"
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
import { computed, defineOptions, onMounted, ref } from 'vue'
import { useHead, useServerSeoMeta } from '@unhead/vue'
import { sleep } from 'radash'
import {
  type ProductColor,
  getFirstAttributeValue,
  isInStock,
} from '@scayle/storefront-nuxt'
import { definePageMeta, useJsonld } from '#imports'
import { useNuxtApp } from '#app'
import { useRoute } from '#app/composables/router'
import { generateProductSchema, sanitizeCanonicalURL } from '~/utils/seo'
import { useCurrentShop, useFormatHelpers } from '#storefront/composables'
import {
  useFavoriteStore,
  usePageState,
  useProductDetails,
  useProductDetailsAddOns,
  useProductDetailsBasketActions,
  useProductPromotions,
  useRouteHelpers,
  useTrackingEvents,
  useZoomGalleryActions,
} from '~/composables'
import { isProductSubscriptionEligible } from '~/modules/subscription/helpers/subscription'
import { ProductColorChip } from '#components'
import { Size } from '#storefront-ui'

const route = useRoute()

const productDetails = await useProductDetails(
  `[slug].vue-${route.params.slug}`,
)
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
  productId,
  combineWithProductIds,
} = productDetails

const { addItemToBasket } = useProductDetailsBasketActions(
  product,
  activeVariant,
  quantity,
)

const { isBuyXGetYPrioritized, isGiftAddedToBasket } =
  useProductPromotions(product)

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

const { index: zoomGalleryIndex, toggle: toggleZoomGallery } =
  useZoomGalleryActions()

const { trackViewItem } = useTrackingEvents()

onMounted(async () => {
  if (!product.value) {
    return
  }
  setPageState('typeId', String(product.value.id))
  await sleep(1000)
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

const sanitizedCanonicalURL = sanitizeCanonicalURL(
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
        href: sanitizeCanonicalURL(
          `${$config.baseUrl}${getProductDetailRoute(product?.value)}`,
        ),
      },
    ],
  }
})

defineOptions({ name: 'ProductDetailPage' })
definePageMeta({ pageType: 'pdp' })
</script>
