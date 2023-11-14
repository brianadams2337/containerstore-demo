<template>
  <ProductCard
    v-bind="{ index, product, isAvailable }"
    :id="product.id"
    :loading="isWishlistFetching"
    class="col-span-6 md:col-span-4 2xl:col-span-3"
    wishlist-remove-icon="close"
    is-wishlist-card
    @productimage:mouseover="isAddToBasketButtonShown = true"
    @productimage:mouseleave="isAddToBasketButtonShown = false"
  >
    <template #header-badge>
      <div class="flex h-max w-max flex-col">
        <ProductBadge
          v-if="isProductSustainable(product)"
          badge-label="sustainable"
        />
        <ProductBadge v-if="product.isNew" badge-label="new" />
        <ProductBadge
          v-for="(campaign, idx) in getSalesRelativeAmountByCategory(
            product,
            'campaign',
          )"
          :key="`campaign-${idx}`"
          class="w-max bg-[#ff6e17]"
          :badge-label="`-${campaign.amount.relative * 100}% EXTRA`"
          :translate="false"
        />
        <ProductBadge
          v-for="(sale, idx) in getSalesRelativeAmountByCategory(
            product,
            'sale',
          )"
          :key="`sale-${idx}`"
          class="w-max bg-red-500"
          :badge-label="`-${sale.amount.relative * 100}%`"
          :translate="false"
        />
      </div>
    </template>
    <template #header-image="{ link, image, imageLoading, name }">
      <DefaultLink :to="link" raw>
        <ProductImage
          v-if="image"
          :image="image"
          :image-loading="imageLoading"
          :alt="name"
          fit="contain"
          sizes="sm:100vw"
          is-centered
          class="absolute inset-0"
        />
      </DefaultLink>
      <div
        v-if="isAvailable"
        class="absolute bottom-0 left-0 top-auto z-40 hidden h-auto w-full p-3 lg:block"
      >
        <AppButton
          type="secondary"
          class="w-full border-gray-350 bg-white p-3 text-xs font-semibold transition"
          :class="isAddToBasketButtonShown ? 'opacity-1' : 'opacity-0'"
          data-test-id="wishlist-card-add-to-cart"
          @click="emit('click:add-to-cart')"
        >
          {{ $t('pdp.add_label') }}
        </AppButton>
      </div>
      <div
        v-else
        class="absolute inset-y-0 flex w-full items-center justify-center"
      >
        <p class="text-xl font-semibold text-[#424144]">
          {{ $t('global.sold_out') }}
        </p>
      </div>
      <div
        v-if="isAvailable"
        class="absolute bottom-0 right-0 top-auto z-30 flex h-auto justify-end pb-[20px] pr-4 lg:hidden"
      >
        <div
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white"
          data-test-id="wishlist-card-add-to-cart-mobile"
          @click="showSizePicker"
        >
          <IconAddToCart class="h-5 w-5" />
        </div>
      </div>
    </template>
    <template #description="{ title, name }">
      <div>
        <div>
          <div
            class="mt-2 w-full justify-between py-2 text-xs font-medium text-primary opacity-50"
          >
            <p>{{ title }}</p>
            <p>{{ name }}</p>
          </div>
          <div>
            <ProductPrice
              data-test-id="wishlist-product-price"
              v-bind="{ price, lowestPriorPrice }"
              :applied-reductions="price.appliedReductions"
              type="whisper"
              size="sm"
              class="text-primary"
            />
          </div>
          <div v-if="isAvailable" class="hidden lg:block">
            <div
              v-if="!hasOneSizeVariantOnly && isChangingSize"
              :key="product.id"
              class="items-center space-x-2 py-4"
            >
              <ProductSizePicker
                :id="product.id"
                class="justify-center"
                :variants="product?.variants || []"
                :value="selectedSize?.value"
                @select-size="onSelectSize"
                @click:outside="isChangingSize = false"
              />
            </div>
            <AppButton
              v-if="!hasOneSizeVariantOnly && !isChangingSize"
              data-test-id="wishlist-card-product-size"
              type="secondary"
              class="mr-2 mt-4"
              @click="isChangingSize = !isChangingSize"
            >
              {{ selectedSize?.label || $t('wishlist.change_size_label') }}
            </AppButton>
            <AppButton
              v-if="!isChangingSize"
              :disabled="sizeSavingId === product.id"
              data-test-id="wishlist-card-add-to-cart"
              class="mt-4"
              @click="emit('click:add-to-cart')"
            >
              {{ $t('pdp.add_label') }}
            </AppButton>
          </div>
        </div>
      </div>
      <SlideIn
        v-show="isLessThan('lg')"
        :name="`wishlistcard_${product.id}`"
        slide-type="fromBottom"
        slide-class="w-full xl:max-w-none h-auto xl:max-h-none top-auto left-0 p-0 pt-0"
      >
        <template #slideInContent>
          <div>
            <div
              class="flex cursor-pointer justify-center py-3"
              @click="toggleFilter"
            >
              <IconAngleDown class="h-4 w-4" />
            </div>
            <div class="flex justify-end border-b px-5 pb-3">
              <div class="text-right">
                <strong class="block text-sm">
                  {{ toCurrency(price.withTax) }}
                </strong>
                <div class="text-xs text-secondary">
                  {{ $t('price.including_vat') }}
                </div>
              </div>
            </div>
            <div class="px-5 pb-2 pt-3">
              <RadioGroup :items="sizes" @update:model-value="sizeSelected" />
            </div>
          </div>
        </template>
      </SlideIn>
    </template>
  </ProductCard>
</template>

<script setup lang="ts">
import {
  LowestPriorPrice,
  Price,
  Product,
  Value,
  Variant,
  getAttributeValue,
  getLowestPrice,
  getSizeFromVariant,
  getVariantBySize,
} from '@scayle/storefront-nuxt'

type Props = {
  index: number
  product: Product
  variant?: Variant
}

const props = withDefaults(defineProps<Props>(), { variant: undefined })

const { fetching: isWishlistFetching, replaceItem: replaceWishlistItem } =
  await useWishlist()
const basket = await useBasket()

const { isLessThan } = useViewport()

const { trackAddToBasket } = useTrackingEvents()

const { toggle: toggleFilter } = useSlideIn(`wishlistcard_${props.product.id}`)

const emit = defineEmits<{
  (e: 'click:change-size', value: Value): void
  (e: 'click:add-to-cart'): void
}>()

const isAddToBasketButtonShown = ref(false)

const hasOneSizeVariantOnly = computed(() => {
  const variants = props.product?.variants
  return (
    variants?.length === 1 &&
    getAttributeValue(variants[0].attributes, 'size') === ONE_SIZE_KEY
  )
})

const price = computed<Price>(() => {
  return props.variant
    ? props.variant.price
    : getLowestPrice(props.product.variants || [])
})

const isAvailable = computed<boolean>(() => {
  return props.product.isActive || !props.product.isSoldOut
})

const selectedSize = computed<Value | undefined>(() => {
  return props.variant && getSizeFromVariant(props.variant, 'size')
})

const lowestPriorPrice = computed<LowestPriorPrice | undefined>(() => {
  const variants = props.product.variants
  const variant = getVariantWithLowestPrice(variants)
  return variant?.lowestPriorPrice
})

const sizes = computed(() => getVariantSizes(props.product.variants))

const getSize = (value: string): VariantSize | undefined => {
  return sizes.value.find((size) => size.value === value)
}

const sizeSelected = (value: string) => {
  const size = getSize(value)

  if (size) {
    changeSizeAndAddToBasket(props.product, size)
    toggleFilter()
  }
}

const changeSizeAndAddToBasket = async (
  product: Product,
  size: VariantSize,
) => {
  const newVariant = getVariantBySize(product.variants || [], size, 'size')
  if (isEmpty(newVariant)) {
    return
  }
  sizeSavingId.value = product.id
  replaceWishlistItem({ productId: product.id }, { variantId: newVariant!.id })

  await basket.addItem({
    variantId: newVariant!.id,
    quantity: 1,
  })

  trackAddToBasket({
    product: props.product,
    variant: newVariant,
    index: props.index,
    list: {
      id: WishlistListingMetadata.ID,
      name: WishlistListingMetadata.NAME,
    },
  })

  showAddToBasketToast(true, product)

  sizeSavingId.value = null
}

const showSizePicker = () => {
  const oneSize = getSize(ONE_SIZE_KEY)

  oneSize ? changeSizeAndAddToBasket(props.product, oneSize) : toggleFilter()
}
const isChangingSize = ref(false)
const sizeSavingId = ref<number | null>(null)

const changeSize = async ({ id, variants }: Product, size: Value) => {
  const newVariant = getVariantBySize(variants || [], size, 'size')
  if (isEmpty(newVariant)) {
    return
  }
  sizeSavingId.value = id
  await replaceWishlistItem({ productId: id }, { variantId: newVariant!.id })
  sizeSavingId.value = null
}

const onSelectSize = (size: Value): void => {
  if (size.value !== selectedSize.value?.value) {
    changeSize(props.product, size)
  }
  isChangingSize.value = false
}
</script>
