import { computed, type Ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useBreadcrumbs, useProductBaseInfo } from '.'
import { useRoute } from '#app/composables/router'
import { useNuxtApp } from '#app'
import {
  generateCategoryBreadcrumbSchema,
  generateProductSchema,
  sanitizeCanonicalURL,
} from '~/utils'
import { useImage } from '#imports'

export function useProductSeoData(product: Ref<Product | undefined | null>) {
  const { $config, $i18n } = useNuxtApp()
  const route = useRoute()

  const canonicalUrl = computed(() => {
    const url = `${$config.public.baseUrl}${route?.fullPath}`
    return sanitizeCanonicalURL(url, [])
  })
  const canonicalLink = computed(() => {
    return [{ rel: 'canonical', key: 'canonical', href: canonicalUrl.value }]
  })

  const robots = 'index, follow'

  const {
    name,
    brand,
    description: productDescription,
    longestCategoryList,
  } = useProductBaseInfo(product)

  const title = computed(() => {
    return $i18n.t('pdp.meta.title', { productName: name.value })
  })

  const description = computed(() => {
    return $i18n.t('pdp.meta.description', { productName: name.value })
  })

  const { getImage } = useImage()
  const images = computed(() => {
    const options = {
      sizes: '100vw',
      provider: 'scayle',
    }
    const images = product.value?.images ?? []
    return images.map(({ hash }) => getImage(hash, options).url)
  })

  const productJsonLd = computed(() => {
    return generateProductSchema({
      productName: name.value || '',
      brandName: brand.value || '',
      url: canonicalUrl.value,
      variants: product.value?.variants || [],
      images: images.value,
      description: productDescription.value,
    })
  })

  const { getBreadcrumbsFromProductCategories } = useBreadcrumbs()
  const productBreadcrumbJsonLd = computed(() => {
    const items = getBreadcrumbsFromProductCategories(
      longestCategoryList.value || [],
    )
    return generateCategoryBreadcrumbSchema(items)
  })

  return {
    robots,
    canonicalLink,
    title,
    description,
    productJsonLd,
    productBreadcrumbJsonLd,
  }
}
