import type {
  CategorySearchSuggestion,
  ProductSearchSuggestion,
  SearchEntity,
} from '@scayle/storefront-nuxt'
import { getFirstAttributeValue } from '@scayle/storefront-nuxt'
import type { LocationQueryRaw } from '#vue-router'

export type CategoryFilter =
  CategorySearchSuggestion['categorySuggestion']['filters'][0]

export const buildFiltersQuery = (
  filters: CategoryFilter[],
): LocationQueryRaw => {
  return filters.reduce<Record<string, string>>((query, filter) => {
    switch (filter.type) {
      case 'attribute':
        return {
          ...query,
          [`filters[${filter.attributeFilter.group.key}]`]:
            filter.attributeFilter.values.map((val) => val.id).join(','),
        }

      case 'boolean':
        return {
          ...query,
          [`filters[${filter.booleanFilter.slug}]`]: 'true',
        }
    }

    return query
  }, {})
}

export const getSearchFilterLabels = (
  filters: CategoryFilter[] = [],
): string[] => {
  return filters.reduce<string[]>((labels, filter) => {
    switch (filter.type) {
      case 'attribute':
        return [
          ...labels,
          ...filter.attributeFilter.values.map(({ label }) => label),
        ]

      case 'boolean':
        return [...labels, filter.booleanFilter.label]
    }

    return labels
  }, [])
}

export const isProductSuggestion = (
  suggestion: SearchEntity,
): suggestion is ProductSearchSuggestion => {
  return suggestion.type === 'product'
}

export const isCategorySuggestion = (
  suggestion: SearchEntity,
): suggestion is CategorySearchSuggestion => {
  return suggestion.type === 'category'
}

export const getSuggestionName = (
  suggestion: SearchEntity,
): string | undefined => {
  if (!suggestion.type) {
    return
  }

  if (isCategorySuggestion(suggestion)) {
    return suggestion.categorySuggestion.category.name
  }

  if (isProductSuggestion(suggestion)) {
    const { attributes } = suggestion.productSuggestion.product
    return getFirstAttributeValue(attributes, 'name')?.label ?? ''
  }
}
