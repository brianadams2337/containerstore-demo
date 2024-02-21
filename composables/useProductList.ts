export const INCLUDED_QUICK_FILTERS = ['sale', 'isNew', 'styleGroup']
const CACHE_TTL = 1000

const listingMetaData = {
  id: CategoryListingMetadata.ID,
  name: CategoryListingMetadata.NAME,
}

export async function useProductList() {
  const route = useRoute()

  const { categoryPath } = await useCategory()

  const facetData = await useFacet({
    key: `useFacet-${categoryPath.value}`,
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
    path: categoryPath.value,
    ...productConditions.value,
    where: {
      ...productConditions?.value?.where,
      term: term.value.toString(),
    },
    perPage: PRODUCTS_PER_PAGE,
    cache: {
      ttl: CACHE_TTL,
      cacheKeyPrefix: `PLP:${categoryPath}`,
    },
    sort: {
      ...selectedSort.value,
    },
  }))

  return {
    ...facetData,
    fetchParameters,
    categoryPath,
    listingMetaData,
  }
}
