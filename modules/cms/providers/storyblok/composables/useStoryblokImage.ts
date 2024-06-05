import type { SbCmsImage } from '../types/storyblok'

type SanitizedImage = {
  src: string
  alt: string
}

export const isMobile = () => useDefaultBreakpoints().isSmaller('md')

export function useStoryblokImageSanitizer() {
  const sanitize = (img: SbCmsImage): SanitizedImage => {
    return {
      src: img[isMobile() ? 'mobile_image' : 'desktop_image']?.filename || '',
      alt: img?.desktop_image?.alt || '',
    }
  }
  return {
    sanitize,
  }
}

export function getTeaserImage(blok: any) {
  const sanitizedImage: SanitizedImage = reactive({
    src: '',
    alt: '',
  })
  const desktopImageProperty = 'teaser_image'
  const mobileImageProperty = 'teaser_image_mobile'

  if (blok) {
    const image = blok[isMobile() ? mobileImageProperty : desktopImageProperty]
    sanitizedImage.src = image?.filename || ''
    sanitizedImage.alt = image?.alt || image?.name || ''
  }
  return sanitizedImage
}
