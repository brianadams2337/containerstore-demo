import {
  TypeaheadSuggestionsEndpointResponseData,
  TypeaheadBrandOrCategorySuggestion,
  TypeaheadProductSuggestion,
  TypeaheadSuggestion,
} from '@scayle/storefront-nuxt'

const useTypeaheadSuggestions = (
  data: Ref<TypeaheadSuggestionsEndpointResponseData | undefined>,
) => {
  const allSuggestions = computed(() => {
    return [data.value?.topMatch, ...(data?.value?.suggestions ?? [])].filter(
      (a) => a,
    )
  })

  const isProduct = (
    suggestion?: TypeaheadSuggestion,
  ): suggestion is TypeaheadProductSuggestion => {
    return suggestion?.type === 'product'
  }

  const isBrand = (
    suggestion?: TypeaheadSuggestion,
  ): suggestion is TypeaheadBrandOrCategorySuggestion => {
    return (
      suggestion?.type === 'brandOrCategory' &&
      suggestion.brandOrCategorySuggestion.primaryMatch === 'brand'
    )
  }

  const isCategory = (
    suggestion?: TypeaheadSuggestion,
  ): suggestion is TypeaheadBrandOrCategorySuggestion => {
    return (
      suggestion?.type === 'brandOrCategory' &&
      suggestion.brandOrCategorySuggestion.primaryMatch === 'category'
    )
  }

  const products = computed(() => allSuggestions.value.filter(isProduct))
  const brands = computed(() => allSuggestions.value.filter(isBrand))
  const categories = computed(() => allSuggestions.value.filter(isCategory))

  const totalCount = computed(
    () => products.value.length + brands.value.length + categories.value.length,
  )

  return {
    products,
    categories,
    brands,
    noSuggestions: computed(() => totalCount.value === 0),
    totalCount,
  }
}

export default useTypeaheadSuggestions
