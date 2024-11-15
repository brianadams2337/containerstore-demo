import { computed, type Ref } from 'vue'
import type { Category } from '@scayle/storefront-nuxt'
import { useBreadcrumbs } from '~/composables'
import { useRoute } from '#app/composables/router'
import { sanitizeCanonicalURL, generateCategoryBreadcrumbSchema } from '~/utils'
import { useNuxtApp } from '#app'
import {
  useAppliedFilters,
  useProductListSort,
} from '#storefront-product-listing'

export function useCategorySeoData(category: Ref<Category | undefined | null>) {
  const { $i18n, $config } = useNuxtApp()
  const route = useRoute()

  const { areFiltersApplied } = useAppliedFilters(route)
  const { isDefaultSortSelected } = useProductListSort(route)
  const { getBreadcrumbsFromCategory } = useBreadcrumbs()

  const robots = computed(() => {
    return !areFiltersApplied.value && isDefaultSortSelected.value
      ? 'index,follow'
      : 'noindex,follow'
  })

  const canonicalLink = computed(() => {
    if (robots.value?.includes('noindex')) {
      return []
    }
    const url = `${$config.public.baseUrl}${route?.fullPath}`
    const href = sanitizeCanonicalURL(url)
    return [{ rel: 'canonical', key: 'canonical', href }]
  })

  const categoryName = computed(() => category.value?.name)

  const metaDescription = computed(() => {
    const category = categoryName.value?.toLowerCase()
    return $i18n.t('plp.seo_description', { category })
  })

  const title = computed(() => {
    if (!category.value) {
      return ''
    }
    const items = getBreadcrumbsFromCategory(category.value, true)
    return items.map(({ value }) => value).join(' - ')
  })

  const categoryBreadcrumbSchema = computed(() => {
    if (!category.value) {
      return []
    }
    const items = getBreadcrumbsFromCategory(category.value, true)
    return generateCategoryBreadcrumbSchema(items)
  })

  return {
    title,
    metaDescription,
    robots,
    canonicalLink,
    categoryBreadcrumbSchema,
  }
}
