import {
  type Value,
  type Variant,
  getBreadcrumbs,
  getCategoriesByRoute,
  getPrice,
  getProductSiblings,
  getVariantBySize,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { getAdvancedAttributes } from '~/utils/attribute'

export async function useProductDetails(key?: string) {
  if (!key) {
    // The key is auto-added so this will only be thrown if a nullish value is passed to the function
    throw Error('missing key argument')
  }

  const route = useRoute()

  const productId = computed(() => {
    const id = String(route.params.slug).split('-').pop() as string
    return parseInt(id, 10)
  })

  const activeVariant = useState<Variant | undefined>(
    `product-details-active-variant`,
  )

  const quantity = useState<number>(`product-quantity-${key}`, () => 1)

  const { getImage } = useImage()

  const productPromise = useProduct({
    params: {
      id: productId.value,
      with: PRODUCT_WITH_PARAMS,
    },
    key: `useProduct-${key}`,
  })

  const { data: product, error, fetching } = productPromise

  if (error.value) {
    throw error.value
  }

  const { brand, name, variantWithLowestPrice } = useProductBaseInfo(product)

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
    return product.value && hasOneSizeProductVariantOnly(product.value)
  })

  const hasSpecial = computed(() => {
    return Boolean(
      !activeVariant.value && price.value?.appliedReductions.length,
    )
  })

  const images = computed(() => {
    const options = {
      sizes: 'sm:100vw md:100vw',
      modifiers: { quality: PRODUCT_IMAGE_QUALITY_MODIFIER },
      provider: 'default',
    }
    const images = product.value?.images ?? []
    return images.map(({ hash }) => getImage(hash, options).url)
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

  const combineWithProductIds = computed(() => {
    return product.value
      ? getAdvancedAttributes<string>({
          product: product.value,
          property: 'combineWith',
        })
          .map((value) => parseInt(value))
          .filter((value) => !isNaN(value))
      : []
  })

  return extendPromise(
    productPromise.then(() => ({})),
    {
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
      combineWithProductIds,
    },
  )
}
