import { computed } from 'vue'
import type {
  ProductSearchQuery,
  AttributeWithBooleanValueFilter,
  AttributeWithValuesFilter,
} from '@scayle/storefront-nuxt'
import { useRoute } from '#app/composables/router'

const FILTERS_PREFIX = 'filters['
export function useAppliedFilters() {
  const route = useRoute()

  const getAttributeValues = (value: string): Array<number> => {
    return value
      .split(',')
      .map((v) => Number(v))
      .filter((v) => !isNaN(v))
  }

  const parseFilterData = () => {
    const queryKeys = Object.keys(route.query)
    const productSearchQuery: ProductSearchQuery = { attributes: [] }

    queryKeys.forEach((queryKey: string) => {
      const value = route.query[queryKey] as string

      if (!value) {
        return
      }

      if (!queryKey.includes(FILTERS_PREFIX)) {
        return
      }
      const filterName = queryKey.replace(FILTERS_PREFIX, '').replace(']', '')

      switch (filterName) {
        case 'minPrice':
        case 'maxPrice':
          if (isNaN(Number(value))) {
            return
          }
          productSearchQuery[filterName] = Number(value)
          break
        case 'term':
          productSearchQuery.term = value
          break
        default:
          if (value === 'true' || value === 'false') {
            const booleanFilter: AttributeWithBooleanValueFilter = {
              type: 'boolean',
              key: filterName,
              value: value === 'true',
            }
            return productSearchQuery.attributes?.push(booleanFilter)
          } else {
            const values = getAttributeValues(value)

            if (values.length === 0) {
              return
            }

            const attributeFilter: AttributeWithValuesFilter = {
              type: 'attributes',
              key: filterName,
              values,
            }

            return productSearchQuery.attributes?.push(attributeFilter)
          }
      }
    })

    return productSearchQuery
  }

  const appliedFilter = computed<ProductSearchQuery>(() => {
    return parseFilterData()
  })

  const appliedFiltersCount = computed<number>(() => {
    let count = 0

    // Add all of the different attribute/boolean filters to the count
    count += appliedFilter.value.attributes?.length ?? 0

    // Count the minPrice/maxPrice filters as one filter
    if (
      appliedFilter.value.minPrice !== undefined ||
      appliedFilter.value.maxPrice !== undefined
    ) {
      count += 1
    }

    return count
  })

  const appliedAttributeValues = computed(() => {
    const values: Record<string, Array<number>> = {}

    appliedFilter.value?.attributes?.forEach((attribute) => {
      if (attribute.type !== 'attributes' || !attribute.key) {
        return
      }

      values[attribute.key] = attribute.values as number[]
    })
    return values
  })

  const appliedBooleanValues = computed(() => {
    const values: Record<string, boolean> = {}

    appliedFilter.value?.attributes?.forEach((attribute) => {
      if (attribute.type === 'boolean') {
        values[attribute.key] = attribute.value
      }
    })
    return values
  })

  const areFiltersApplied = computed<boolean>(() => {
    return appliedFiltersCount.value > 0
  })

  return {
    appliedFilter,
    appliedFiltersCount,
    appliedAttributeValues,
    appliedBooleanValues,
    areFiltersApplied,
  }
}
