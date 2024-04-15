import type {
  SearchEntity,
  ProductSearchSuggestion,
  CategorySearchSuggestion,
} from '@scayle/storefront-nuxt'
import { getFirstAttributeValue } from '@scayle/storefront-nuxt'

export type CategoryFilter =
  CategorySearchSuggestion['categorySuggestion']['filters'][0]

type CategoryFilterByKey = Record<string, number[]>

export const groupSearchCategoryFiltersByKey = (
  filters: CategoryFilter[],
): CategoryFilterByKey => {
  return filters.reduce<CategoryFilterByKey>((filterMap, filter) => {
    if (filter.type !== 'attribute') {
      return filterMap
    }
    const key = filter.attributeFilter.group.key
    const normalizedValues = filter.attributeFilter.values.map(({ id }) => id)
    filterMap[key] = normalizedValues
    return filterMap
  }, {})
}

export const getSearchFilterLabels = (
  filters: CategoryFilter[] = [],
): string[] => {
  return filters.reduce<string[]>((labels, filter) => {
    if (filter.type !== 'attribute') {
      return labels
    }
    const newLabels = filter.attributeFilter.values.map(({ label }) => label)
    labels = [...labels, ...newLabels]
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
