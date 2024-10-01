import type { ProductImage } from '@scayle/storefront-nuxt'

export const getPrimaryImage = (images: ProductImage[]) => {
  return images.find(isPrimaryImage) ?? images[0]
}

const isPrimaryImage = (image: ProductImage) => {
  return 'primaryImage' in (image.attributes ?? {})
}

export const sortProductImages = (images: ProductImage[]) => {
  return images.toSorted((imageA, imageB) => {
    if (isPrimaryImage(imageB)) {
      return 1
    }

    if (isPrimaryImage(imageA)) {
      return -1
    }

    return 0
  })
}
