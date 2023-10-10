<template>
  <ProductDetailSkeleton v-if="fetching" />
  <PageContent v-else-if="product">
    <GoBackLink use-window-history class="mt-4 md:ml-7 md:mt-7" />
    <div class="flex flex-1 flex-col items-start md:flex-row md:gap-3">
      <ProductImageGallery
        :images="product?.images"
        @click:image="toggleZoomGallery(true, $event)" />
      <ZoomGallery
        v-if="zoomGallery.display"
        :images="product.images"
        :active-index="zoomGallery.index"
        @click:close-zoom-gallery="toggleZoomGallery(false)" />
      <div class="sticky right-0 top-0 mt-5 w-full md:w-1/2 md:px-9 xl:w-1/3">
        <div class="w-full bg-white">
          <div v-if="product.isSoldOut" class="left-0 top-0">
            <ProductBadge
              class="ml-0"
              :badge-label="
                getBadgeLabel({
                  isSoldOut: product.isSoldOut,
                })
              " />
          </div>
          <div class="my-2 max-w-xs md:mt-1">
            <div class="mb-2">
              <ProductDetailBreadcrumbs :links="breadcrumbs" />
            </div>
            <div
              class="text-xs font-semibold text-secondary"
              data-test-id="pdp-product-brand">
              {{ brandName }}
            </div>
            <div class="flex items-start justify-between md:flex-col">
              <Headline
                :size="isGreaterOrEquals('md') ? '2xl' : 'xl'"
                :is-uppercase="false"
                class="!leading-snug"
                data-test-id="pdp-product-name"
                tag="h1">
                {{ productName }}
              </Headline>
              <ProductPrice
                v-if="price"
                size="xl"
                class="md:mt-6"
                :type="isGreaterOrEquals('md') ? 'normal' : 'loud'"
                :price="price"
                :lowest-prior-price="lowestPriorPrice"
                :applied-reductions="price?.appliedReductions"
                show-tax-info
                :show-price-from="hasSpecial"
                :show-price-reduction-badge="hasSpecial" />
            </div>
          </div>
          <div class="w-full md:w-3/4">
            <ProductDetailGroup class="mt-6">
              <ProductSiblingPicker :items="productSiblings" with-values>
                <template #item="{ item }">
                  <DefaultLink
                    raw
                    class="flex items-center justify-center"
                    :to="getProductDetailRoute(product, item.id)">
                    <ColorChip
                      :is-active="item.id === product.id"
                      :size="isGreaterOrEquals('md') ? Size.LG : Size.XL"
                      :color="item.colors[0] as ProductColor" />
                  </DefaultLink>
                </template>
              </ProductSiblingPicker>
            </ProductDetailGroup>

            <ProductSizePicker
              v-if="!hasOneSizeVariantOnly"
              :id="product.id"
              :value="
                getFirstAttributeValue(activeVariant?.attributes, 'size')?.value
              "
              class="mt-8"
              :variants="product.variants ?? []"
              @select-size="handleSelectedSize" />

            <!-- ComputedAddOns == [] -->
            <AddOnsSelector
              v-if="availableAddOns.length"
              class="mt-8"
              :add-on-variant-ids="availableAddOns"
              :class="{ hidden: !activeVariant }"
              @click:service-selection="onAddOnSelected" />
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
                border-sm
                @click="addItemToBasket">
                {{ $t('pdp.add_label') }}
              </AppButton>
              <AppButton
                v-if="!fetchingWishlist"
                class="ml-2 box-border border border-gray-350 !px-2"
                type="ghost"
                :data-test-id="
                  isInWishlist
                    ? 'remove-item-from-wishlist-button'
                    : 'add-item-to-wishlist-button'
                "
                rounded
                :disabled="isWishlistToggling"
                @click="onToggleWishlist">
                <template #icon="{ _class }">
                  <IconHeartFull v-if="isInWishlist" :class="_class" />
                  <IconHeart v-else :class="_class" />
                </template>
              </AppButton>
            </div>
            <div class="mt-3">
              <ProductDetailGroup
                v-if="sliderProducts.length"
                data-test-id="combine-with-slider">
                <template #headline>
                  {{ $t('global.product_recommendation') }}
                </template>
                <ProductRecommendations
                  size="4xs"
                  :products="sliderProducts"
                  :loading="fetchingCombineWithProducts"
                  @intersect:column="trackViewListing"
                  @click:recommendation="trackRecommendationClick" />
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
  FetchProductsParams,
  Product,
  ProductImage,
  Value,
  getVariantBySize,
  flattenDeep,
  getAttributeValue,
  Variant,
  getFirstAttributeValue,
  getCategoriesByRoute,
  getBadgeLabel,
  getPrice,
  getBreadcrumbs,
  getProductSiblings,
  flattenFieldSet,
  ProductColor,
  isInStock,
} from '@scayle/storefront-nuxt'
import { Size, Action } from '~/constants'

const listingMetaData = {
  name: 'ADP',
  id: 'ADP',
}
const route = useRoute()

const store = useStore()

const { $alert, $i18n, $config } = useNuxtApp()

// TODO slug is a stringified productName + productId combination. this can be automatically split into name and id by using the route structure name_id with an underscore in the route.ts helper
const productId = computed(() => {
  return String(route.params.slug)?.substring(
    route.params.slug.lastIndexOf('-') + 1,
  )
})

const {
  data: product,
  error,
  fetching,
} = await useProduct({
  params: {
    id: parseInt(productId.value),
  },
  options: {
    lazy: true,
  },
  key: `useProduct-${productId.value}`,
})

if (error.value) {
  throw error.value
}

const { fetching: basketIdle, addItem: addBasketItem } = await useBasket({
  options: { lazy: true, autoFetch: true },
})
const { addGroupToBasket } = await useBasketGroup()
const {
  fetching: fetchingWishlist,
  contains: wishlistContains,
  toggleItem: toggleWishlistItem,
} = await useWishlist({ options: { lazy: true, autoFetch: true } })

const { state: zoomGallery, toggle: toggleZoomGallery } =
  useZoomGalleryActions()

const { trackAddToBasket, trackViewItemList, trackViewItem, trackSelectItem } =
  useTrackingEvents()

const isWishlistToggling = ref(false)

const productCategories = computed(() => {
  return product.value ? getCategoriesByRoute(product.value, null) : []
})

const breadcrumbs = computed(() => getBreadcrumbs(productCategories.value))

const brandName = computed(() => {
  return getFirstAttributeValue(product.value?.attributes, 'brand')?.label
})

const productName = computed(() => {
  return getFirstAttributeValue(product.value?.attributes, 'name')?.label
})

const { isGreaterOrEquals } = useViewport()
const activeVariant = ref<Variant>()
const variantWithLowestPrice = computed(() =>
  getVariantWithLowestPrice(product.value?.variants || []),
)
const lowestPriorPrice = computed(
  () =>
    activeVariant.value?.lowestPriorPrice ||
    variantWithLowestPrice.value?.lowestPriorPrice ||
    product.value?.lowestPriorPrice,
)

const price = computed(() =>
  activeVariant.value
    ? getPrice(activeVariant.value)
    : variantWithLowestPrice.value?.price,
)

const hasSpecial = computed(() => {
  return Boolean(!activeVariant.value && price.value?.appliedReductions.length)
})

const productSiblings = computed(() => {
  return getProductSiblings(product.value, 'color')
})

const handleSelectedSize = (value: Value) => {
  if (product.value?.variants) {
    activeVariant.value = getVariantBySize(
      product.value?.variants,
      value,
      'size',
    )
  }
}

const hasOneSizeVariantOnly = computed(() => {
  const variants = product.value?.variants
  return (
    variants?.length === 1 &&
    getAttributeValue(variants[0].attributes, 'size') === ONE_SIZE_KEY
  )
})

// add ons
const addOnServiceAttribute = computed(() => {
  return product.value?.advancedAttributes
    ? product.value?.advancedAttributes.additionalService ?? null
    : null
})

const availableAddOns = computed<number[]>(() => {
  if (!addOnServiceAttribute.value) {
    return []
  }

  const flattenedValues = addOnServiceAttribute.value.values
    .map((value) => ({
      ...flattenDeep(flattenFieldSet(value.fieldSet))[0],
      values: flattenDeep(
        value.groupSet.map((g) => flattenFieldSet(g.fieldSet)),
      ),
    }))
    .map((flattened: any) => flattened.value)

  return flattenedValues.map((val) => parseInt(val))
})
const addOnsSelected = ref<{ [id: number]: boolean }>({})
const onAddOnSelected = ({
  isSelected,
  variantId,
}: {
  isSelected: boolean
  variantId: number
}) => {
  addOnsSelected.value = {
    ...addOnsSelected.value,
    [variantId]: isSelected,
  }
}

const isAnyAddOnSelected = computed(() => {
  const anySelected = Object.keys(addOnsSelected.value).find(
    (key) => addOnsSelected.value[key as any],
  )
  return !!anySelected
})

const addItemToBasket = async () => {
  if (hasOneSizeVariantOnly.value && product.value?.variants) {
    activeVariant.value = product.value?.variants[0]
  }

  if (activeVariant.value === undefined) {
    $alert.show($i18n.t('basket.notification.select_size'), Action.CONFIRM)
    return
  }

  const productName =
    getFirstAttributeValue(product.value?.attributes, 'name')?.label ||
    $i18n.t('wishlist.product')

  try {
    isAnyAddOnSelected.value
      ? await addGroupToBasket({
          mainItem: { variantId: activeVariant.value.id, quantity: 1 },
          items: [
            ...Object.keys(addOnsSelected.value).map((v) => ({
              variantId: parseInt(v),
              quantity: 1,
            })),
          ],
        })
      : await addBasketItem({ variantId: activeVariant.value.id, quantity: 1 })
    showBasketFlyOut()

    showAddToBasketToast(true, product.value)

    if (product.value) {
      trackAddToBasket({
        product: product.value,
        variant: activeVariant.value,
        index: 1,
      })
    }
  } catch {
    $alert.show(
      $i18n.t('basket.notification.add_to_basket_error', { productName }),
      Action.CONFIRM,
    )
  }
}

const isInWishlist = computed(() => {
  return wishlistContains({ productId: parseInt(productId.value, 10) })
})

const onToggleWishlist = async () => {
  const id = parseInt(productId.value, 10)
  const isNewItemInWishlist = !isInWishlist.value

  trackWishlistEvent(isNewItemInWishlist ? 'added' : 'removed', {
    product: product.value,
    variant: activeVariant.value,
  })

  isWishlistToggling.value = true
  await toggleWishlistItem({ productId: id })
  isWishlistToggling.value = false

  showWishlistToast(isNewItemInWishlist, product.value)
}

const combineWithProductValues = getAdvancedAttributes({
  product: product.value as Product,
  property: 'combineWith',
})
const combineWithProductIds = computed(() =>
  combineWithProductValues
    ? combineWithProductValues
        .split(',')
        .map((productId: string) => parseInt(productId, 10))
    : [],
)
const recommendationsFetchParams = ref<FetchProductsParams>({ ids: [] })

watch(
  () => combineWithProductIds.value,
  (ids) => {
    recommendationsFetchParams.value = { ids }
  },
  { immediate: true },
)

const { data: combineWithProducts, fetching: fetchingCombineWithProducts } =
  await useProductsByIds({
    params: recommendationsFetchParams,
    key: `products-pdpSlider-combineWith-${productId}`,
  })

const combineWith = computed(() => combineWithProducts.value || [])
const sliderProducts = computed(() =>
  combineWith.value.length
    ? combineWith.value.filter(
        (product) => product.isActive && !product.isSoldOut,
      )
    : [],
)

const trackViewListing = ({ items }: { row: number; items: Product[] }) => {
  trackViewItemList({ items, listingMetaData })
}

const trackRecommendationClick = (product: Product, index: number) => {
  trackSelectItem({
    product,
    category: {
      ...getDeepestCategoryForTracking(product.categories),
    },
    listingMetaData,
    index,
    ...(route.name && { source: `${String(route.name)}|RecommendationSlider` }),
    soldOut: product.isSoldOut,
    pagePayload: {
      content_name: route.fullPath,
      page_type: store.value.pageType,
      page_type_id: productId.value.toString() || '',
    },
  })
}

onMounted(async () => {
  store.value.pageTypeId = productId.value
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

const img = useImage()
const imageOptions = {
  sizes: 'sm:100vw md:100vw',
  modifiers: { quality: '75' },
  provider: 'default',
}
const images = computed(() => {
  return (
    product.value?.images?.map(
      (image: ProductImage) => img?.getImage(image.hash, imageOptions).url,
    ) || []
  )
})

useJsonld(() =>
  generateProductSchema({
    price: formatPrice(price.value?.withTax || 0),
    productName: productName.value || '',
    brandName:
      getFirstAttributeValue(product.value?.attributes, 'brand')?.label || '',
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
        href: sanitizeCanonical(
          `${$config.baseUrl}${getProductDetailRoute(product?.value)}`,
        ),
      },
    ],
  }
})
</script>

<script lang="ts">
export default {
  name: 'ProductDetailPage',
}
</script>
