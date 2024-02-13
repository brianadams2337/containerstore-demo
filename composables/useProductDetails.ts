import {
  type Variant,
  type Value,
  getCategoriesByRoute,
  getBreadcrumbs,
  getPrice,
  getProductSiblings,
  getVariantBySize,
} from '@scayle/storefront-nuxt'

const listingMetaData = {
  name: 'PDP',
  id: 'PDP',
}

export async function useProductDetails(key = 'product-details') {
  const route = useRoute()

  const productId = computed(() => {
    const id = String(route.params.slug).split('-').pop() as string
    return parseInt(id, 10)
  })

  const {
    data: product,
    error,
    fetching,
  } = await useProduct({
    params: {
      id: productId.value,
      with: PRODUCT_WITH_PARAMS,
    },
    key: `useProduct-${productId.value}`,
  })

  if (error.value) {
    throw error.value
  }

  const { brand, name, variantWithLowestPrice } = useProductBaseInfo(product)

  const activeVariant = useState<Variant | null | undefined>(
    `active-variant-${key}-${productId.value}`,
  )

  const quantity = useState<number>(
    `product-quantity-${key}-${productId.value}`,
    () => 1,
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
    return hasOneSizeProductVariantOnly(product.value)
  })

  const hasSpecial = computed(() => {
    return Boolean(
      !activeVariant.value && price.value?.appliedReductions.length,
    )
  })

  const { getImage } = useImage()

  const images = computed(() => {
    const options = {
      sizes: 'sm:100vw md:100vw',
      modifiers: { quality: PRODUCT_IMAGE_QUALITY_MODIFIER },
      provider: 'default',
    }
    const images = product.value?.images
    return images.map(({ hash }) => getImage(hash, options).url) || []
  })

  const siblings = computed(() => {
    return getProductSiblings(product.value, 'color') || []
  })

  const availableQuantity = computed(() => {
    return getQuantitySelectionList(activeVariant.value?.stock.quantity, true)
  })

  const categories = computed(() => {
    return product.value ? getCategoriesByRoute(product.value, null) : []
  })

  const breadcrumbs = computed(() => getBreadcrumbs(categories.value))

  return {
    productId,
    brand,
    name,
    price,
    lowestPriorPrice,
    siblings,
    activeVariant,
    hasOneSizeVariantOnly,
    images,
    hasSpecial,
    handleSelectedSize,
    availableQuantity,
    quantity,
    categories,
    breadcrumbs,
    fetching,
    product,
    listingMetaData,
  }
}
