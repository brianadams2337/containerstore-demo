import { CmsImageStoryblok } from '../types/component-types-sb'

type SanitizedImage = {
  src: string
  alt: string
}

// TODO remove this function once responsive utility is added
const mockUseBreakPointsComposable = () => {
  return { md: ref(true) }
}

export const useStoryblokImageSanitizer = () => {
  const { md } = mockUseBreakPointsComposable()

  const sanitize = (img: CmsImageStoryblok): SanitizedImage => {
    return {
      src: img[!md.value ? 'mobile_image' : 'desktop_image']?.filename || '',
      alt: img?.desktop_image?.alt || '',
    }
  }
  return {
    sanitize,
  }
}

export function getTeaserImage(blok: any) {
  const { md } = mockUseBreakPointsComposable()

  const sanitizedImage: SanitizedImage = reactive({
    src: '',
    alt: '',
  })
  const desktopImageProperty = 'teaser_image'
  const mobileImageProperty = 'teaser_image_mobile'

  if (blok) {
    const image = blok[!md.value ? mobileImageProperty : desktopImageProperty]
    sanitizedImage.src = image?.filename || ''
    sanitizedImage.alt = image?.alt || image?.name || ''
  }
  return sanitizedImage
}
