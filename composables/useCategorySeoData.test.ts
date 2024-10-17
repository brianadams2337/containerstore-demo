import { ref } from 'vue'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { useCategorySeoData } from '~/composables/useCategorySeoData'
import { categoryFactory } from '~/test/factories/category'

const mocks = vi.hoisted(() => {
  return {
    useNuxtApp: {
      $i18n: {
        t: vi.fn((key, params) => `${key} ${JSON.stringify(params)}`),
      },
      $config: {
        public: {
          baseUrl: 'http://localhost',
        },
      },
    },
    useAppliedFilters: {
      productConditions: { value: '' },
      appliedFilter: { value: {} },
      appliedFiltersCount: { value: 0 },
      areFiltersApplied: { value: false },
    },
    useProductListSort: { isDefaultSortSelected: { value: true } },
    useBreadcrumbs: { value: '' },
  }
})

// Mock dependencies
vi.mock('#app', () => ({
  useNuxtApp: vi.fn().mockReturnValue(mocks.useNuxtApp),
}))

vi.mock('~/composables', () => ({
  useAppliedFilters: vi.fn().mockReturnValue(mocks.useAppliedFilters),
  useProductListSort: vi.fn().mockReturnValue(mocks.useProductListSort),
  useBreadcrumbs: vi.fn().mockReturnValue(mocks.useBreadcrumbs),
}))

vi.mock('#app/composables/router', () => ({
  useRoute: () => ({
    fullPath: '/category/test-category',
  }),
}))

vi.mock('~/utils', () => ({
  sanitizeCanonicalURL: vi.fn((url) => url),
  generateCategoryBreadcrumbSchema: vi.fn((items) => items),
}))

describe('useCategorySeoData', () => {
  beforeAll(() => {
    mocks.useAppliedFilters.areFiltersApplied.value = false
    mocks.useProductListSort.isDefaultSortSelected.value = true
  })

  describe('robots', () => {
    it('robots should have index, follow', () => {
      const { robots } = useCategorySeoData(ref())

      expect(robots.value).toBe('index,follow')
    })

    it('robots should have noindex, follow', () => {
      mocks.useAppliedFilters.areFiltersApplied.value = true

      const { robots } = useCategorySeoData(ref())

      expect(robots.value).toBe('noindex,follow')
    })
  })

  describe('canonicalLink', () => {
    it('canonicalLink should be empty', () => {
      mocks.useProductListSort.isDefaultSortSelected.value = false
      const { canonicalLink } = useCategorySeoData(ref())

      expect(canonicalLink.value).toStrictEqual([])
    })

    it('canonicalLink should have correct value', () => {
      mocks.useAppliedFilters.areFiltersApplied.value = false
      mocks.useProductListSort.isDefaultSortSelected.value = true

      const { canonicalLink } = useCategorySeoData(ref())

      expect(canonicalLink.value).toStrictEqual([
        {
          href: 'http://localhost/category/test-category',
          key: 'canonical',
          rel: 'canonical',
        },
      ])
    })
  })

  describe('metaDescription', () => {
    it('metaDescription should be default', () => {
      const { metaDescription } = useCategorySeoData(ref())
      expect(metaDescription.value).toBe('plp.seo_description {}')
    })

    it('metaDescription should have category name', () => {
      const { metaDescription } = useCategorySeoData(
        ref(categoryFactory.build({ name: 'test-category' })),
      )
      expect(metaDescription.value).toBe(
        'plp.seo_description {"category":"test-category"}',
      )
    })
  })

  it('should have empty categoryBreadcrumbSchema', () => {
    const { categoryBreadcrumbSchema } = useCategorySeoData(ref())
    expect(categoryBreadcrumbSchema.value).toHaveLength(0)
  })
})
