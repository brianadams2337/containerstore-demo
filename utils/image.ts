import {
  getAttributeValue,
  getImageFromList,
  isImageType,
  ProductImage,
} from '@scayle/storefront-nuxt'

const getFirstModelImage = (images: ProductImage[], index = 0) => {
  const baseImages = images.filter(
    (image: ProductImage) =>
      getAttributeValue(image.attributes, 'imageBackground') === 'grey',
  )

  const needsBreakerImage = (index + 1) % 5 === 0

  if (needsBreakerImage) {
    const breakerImage =
      baseImages.find(
        (image: ProductImage) =>
          getAttributeValue(image.attributes, 'image1stView') ===
          '1st_model_image',
      ) || getImage(baseImages, 'model_image', 'front')

    if (breakerImage) {
      return breakerImage
    }
  }

  let firstImage = getImage(baseImages, 'modeloutfit_image', 'front')

  if (!firstImage) {
    firstImage = getImage(baseImages, 'modeloutfit_image', 'front', true)
  }

  if (!firstImage) {
    firstImage = getImage(baseImages, 'model_image', 'front', true)
  }
  if (!firstImage) {
    firstImage = getImage(baseImages, 'bust_image', 'front', true)
  }

  if (!firstImage) {
    firstImage = baseImages[0]
  }

  if (!firstImage) {
    firstImage = images[0]
  }

  return firstImage
}

const getDetailPageImages = (images: ProductImage[]) => {
  const baseImages = images.filter(
    (image: ProductImage) =>
      getAttributeValue(image.attributes, 'imageBackground') === 'grey',
  )

  let firstImage = baseImages.find(
    (image: ProductImage) =>
      getAttributeValue(image.attributes, 'image1stView') === '1st_model_image',
  )

  const hasModelImages = getImage(baseImages, 'model_image', 'front', true)

  let usingBustImages = false
  if (!firstImage && !hasModelImages) {
    usingBustImages = true
    firstImage = getImage(baseImages, 'bust_image', 'front', true)
  }

  const returnImages = [
    firstImage,
    getImage(baseImages, 'model_image', 'front'),
    getImage(baseImages, 'model_image', 'back'),
    ...baseImages.filter(
      (image: ProductImage) =>
        getAttributeValue(image.attributes, 'imageKind') === 'model_image' &&
        getAttributeValue(image.attributes, 'imageView') === undefined,
    ),
    ...baseImages.filter(
      (image: ProductImage) =>
        getAttributeValue(image.attributes, 'imageKind') ===
        'modeloutfit_image',
    ),

    ...(usingBustImages
      ? baseImages.filter(
          (image: ProductImage) =>
            getAttributeValue(image.attributes, 'imageKind') === 'bust_image',
        )
      : []),
    getImage(baseImages, 'detail_image', 'front'),
    getImage(baseImages, 'detail_image', 'back'),
    ...baseImages.filter(
      (image: ProductImage) =>
        getAttributeValue(image.attributes, 'imageKind') === 'detail_image' &&
        getAttributeValue(image.attributes, 'imageView') === undefined,
    ),
  ].filter((e) => !!e)

  return [...new Set(returnImages)]
}

const getBasketImage = (images: ProductImage[]) => {
  return getDetailPageImages(images)[0]?.hash
}

const getImage = (
  images: ProductImage[],
  imageKind: string,
  imageView: string,
  imageViewOptional = false,
) => {
  return (
    images.find(
      (image: ProductImage) =>
        getAttributeValue(image.attributes, 'imageKind') === imageKind &&
        getAttributeValue(image.attributes, 'imageView') === imageView,
    ) ||
    (imageViewOptional &&
      images.find(
        (image: ProductImage) =>
          getAttributeValue(image.attributes, 'imageKind') === imageKind,
      )) ||
    undefined
  )
}

export default {
  getImageFromList,
  isImageType,

  getDetailPageImages,

  getFirstModelImage,
  getBasketImage,

  showDividerTag(index: number, arrayLength: number) {
    return index >= 0 && arrayLength > 1 && index < arrayLength - 1
  },

  getModelImages: (images: ProductImage[]) => {
    return getDetailPageImages(images).slice(1)
  },

  getAttribute(image: ProductImage, key: string) {
    return (image.attributes?.[key]?.values as any)?.value
  },
}
