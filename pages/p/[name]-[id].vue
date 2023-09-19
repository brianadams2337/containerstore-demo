<template>
  <ProductDetailSkeleton v-if="fetching" />
  <PageContent v-else>
    <GoBackLink use-window-history class="mt-4 md:ml-7 md:mt-7" />
    <div class="flex flex-1 flex-col items-start md:flex-row md:gap-3">
      <ProductImageGallery :images="product.images" />
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
                :size="md ? '2xl' : 'xl'"
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
                :type="md ? 'normal' : 'loud'"
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
                    :to="getProductDetailRoute(product)">
                    <ColorChip
                      :is-active="item.id === product.id"
                      :size="md ? Size.LG : Size.XL"
                      :color="item.colors[0]" />
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
              :add-ons="availableAddOns"
              @click:service-selection="() => {}" />
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
                @click="onToggleWishlist">
                <template #icon="{ _class }">
                  <IconHeartFull v-if="isInWishlist" :class="_class" />
                  <IconHeart v-else :class="_class" />
                </template>
              </AppButton>
            </div>
            <!-- 
            <div class="mt-3">
              <ProductDetailGroup
                v-if="sliderProducts.length"
                data-test-id="combine-with-slider">
                <template #headline>
                  {{ $t('global.product_recommendation') }}
                </template>
                <p>Recommendation Slider</p>
                  <ProductRecommendations
                  size="4xs"
                  :products="sliderProducts"
                  :loading="fetchingCombineWithProducts"
                  @intersect:column="trackViewListing"
                  @click:recommendation="trackRecommendationClick" /> 
              </ProductDetailGroup>
            </div>
                  -->
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
} from '@scayle/storefront-nuxt'
import { Size } from '~/constants'
const {
  params: { id = '-1' },
} = useRoute()

const productId = computed(() =>
  (id as string).substring(id.lastIndexOf('-') + 1),
)

const { data: product, fetching } = await useProduct(
  {
    id: parseInt(productId.value),
    with: {
      attributes: {
        withKey: [
          'color',
          'brand',
          'name',
          'fastenerType',
          'design',
          'extras',
          'material',
          'print',
          'careInstructions',
          'fitting',
          'upperLength',
          'sleeveLength',
          'shirtCut',
          'shortsLength',
          'trousersLength',
          'skirtLength',
          'neckline',
          'trousersCut',
        ],
      },
      advancedAttributes: {
        withKey: [
          'materialCompositionTextile',
          'productDescription',
          'combineWith',
          'additionalService',
        ],
      },
      variants: {
        attributes: {
          withKey: ['price', 'size'],
        },
        lowestPriorPrice: true,
      },
      images: {
        attributes: {
          withKey: ['imageType', 'imageView', 'imageBackground'],
        },
      },
      categories: 'all',
      siblings: {
        images: {
          attributes: {
            withKey: ['imageType', 'imageView', 'imageBackground'],
          },
        },
        attributes: {
          withKey: ['color', 'name', 'brand'],
        },
      },
      priceRange: true,
      lowestPriorPrice: true,
    },
  },
  { autoFetch: true },
)

const productCategories = computed(() =>
  product.value ? getCategoriesByRoute(product.value, null) : [],
)

const breadcrumbs = computed(() => getBreadcrumbs(productCategories.value))

const brandName = computed(
  () => getFirstAttributeValue(product.value?.attributes, 'brand')?.label,
)

const productName = getFirstAttributeValue(product.value?.attributes, 'name')
  ?.label

const { md } = useViewportBreakpoints()
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

const hasSpecial = computed(() =>
  Boolean(!activeVariant.value && price.value?.appliedReductions.length),
)

const productSiblings = computed(() =>
  getProductSiblings(product.value, 'color'),
)

const handleSelectedSize = (value: Value) => {
  if (product.value?.variants) {
    activeVariant.value = getVariantBySize(
      product.value.variants,
      value,
      'size',
    )
  }
}

const hasOneSizeVariantOnly = computed(() => {
  const variants = product.value?.variants
  return (
    variants?.length === 1 &&
    getAttributeValue(variants[0].attributes, 'size') === 'one_size'
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

// TODO basket
const basketIdle = ref(false)
const addItemToBasket = () => {}

// TODO wishlist
const fetchingWishlist = ref(false)
const isInWishlist = ref(false)
const onToggleWishlist = () => {}

// Reco Slider
// const combineWithProductValues = getAdvancedAttributes({
//   product: product.value as Product,
//   property: 'combineWith',
// })
// const combineWithProductIds = computed(() =>
//   combineWithProductValues
//     ? combineWithProductValues
//         .split(',')
//         .map((productId: string) => parseInt(productId, 10))
//     : [],
// )
// const recommendationsFetchParams = ref<FetchProductsParams>({ ids: [] })

// watch(
//   () => combineWithProductIds.value,
//   (ids) => {
//     recommendationsFetchParams.value = { ids }
//   },
// )

// const { data: combineWithProducts, pending: fetchingCombineWithProducts } =
//   await useProductsByIds(
//     recommendationsFetchParams,
//     undefined,
//     `products-pdpSlider-combineWith-${productId}`,
//   )

// const combineWith = computed(() => combineWithProducts.value || [])
// const sliderProducts = computed(() =>
//   combineWith.value.length
//     ? combineWith.value.filter(
//         (product) => product.isActive && !product.isSoldOut,
//       )
//     : [],
// )

// tracking
const trackViewListing = () => {}
const trackRecommendationClick = () => {}
</script>

<script lang="ts">
// name script tag
export default {
  name: 'ProductDetailPage',
}
</script>
