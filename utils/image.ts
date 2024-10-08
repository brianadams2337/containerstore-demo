import type { ProductImage } from '@scayle/storefront-nuxt'

export const getPrimaryImage = (images: ProductImage[]) => {
  return images.find(isPrimaryImage) ?? images[0]
}

const isPrimaryImage = (image: ProductImage) => {
  return 'primaryImage' in (image.attributes ?? {})
}

export const sortProductImages = (images: ProductImage[]) => {
  return images.toSorted((imageA, imageB) => {
    const isImageAPrimary = isPrimaryImage(imageA)
    const isImageBPrimary = isPrimaryImage(imageB)

    if (isImageAPrimary && isImageBPrimary) {
      return 0
    }

    if (isImageBPrimary) {
      return 1
    }

    if (isImageAPrimary) {
      return -1
    }

    return 0
  })
}
