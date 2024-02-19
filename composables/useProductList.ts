export const INCLUDED_QUICK_FILTERS = ['sale', 'isNew', 'styleGroup']
const CACHE_TTL = 1000

const listingMetaData = {
  id: CategoryListingMetadata.ID,
  name: CategoryListingMetadata.NAME,
}

export async function useProductList(
  categoryPath?: string
) {
  const route = useRoute()

  const _categoryPath = computed(() => {
    if (categoryPath) {
      return categoryPath
    }
    return Array.isArray(route.params.category)
      ? `/${route.params.category.join('/')}`
      : `/${route.params.category}`
  })

  const facetData = await useFacet({
    key: `useFacet-${_categoryPath.value}`,
    params: {
      with: {
        product: {
          attributes: {
            withKey: [
              'color',
              'brand',
              'name',
              'promotion',
              ...SUSTAINABILITY_ATTRIBUTES,
            ],
          },
          variants: {
            attributes: {
              withKey: ['price'],
            },
            lowestPriorPrice: true,
          },
          siblings: {
            attributes: { withKey: ['color', 'brand', 'name'] },
          },
          images: {
            attributes: {
              withKey: [
                'imageType',
                'imageView',
                'imageBackground',
                'imageKind',
              ],
            },
          },
          priceRange: true,
          lowestPriorPrice: true,
          categories: {
            properties: {
              withName: ['baseCategories'],
            },
          },
        },
      },
      includedFilters: INCLUDED_QUICK_FILTERS,
    },
  })

  const term = computed(() => route.query.term || '')

  const { productConditions } = useQueryFilterState({
    defaultSort: DEFAULT_SORTING_KEY,
  })

  const { selectedSort } = useProductListSort(facetData.selectedCategory)

  const fetchParameters = computed(() => ({
    path: _categoryPath.value,
    ...productConditions.value,
    where: {
      ...productConditions?.value?.where,
      term: term.value.toString(),
    },
    perPage: PRODUCTS_PER_PAGE,
    cache: {
      ttl: CACHE_TTL,
      cacheKeyPrefix: `PLP:${_categoryPath}`,
    },
    sort: {
      ...selectedSort.value,
    },
  }))

  return {
    ...facetData,
    fetchParameters,
    categoryPath: _categoryPath,
    listingMetaData,
  }
}
