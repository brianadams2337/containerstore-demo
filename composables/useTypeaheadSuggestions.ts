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

  function isProduct(s?: TypeaheadSuggestion): s is TypeaheadProductSuggestion {
    return s?.type === 'product'
  }

  function isBrand(
    s?: TypeaheadSuggestion,
  ): s is TypeaheadBrandOrCategorySuggestion {
    return (
      s?.type === 'brandOrCategory' &&
      s.brandOrCategorySuggestion.primaryMatch === 'brand'
    )
  }

  function isCategory(
    s?: TypeaheadSuggestion,
  ): s is TypeaheadBrandOrCategorySuggestion {
    return (
      s?.type === 'brandOrCategory' &&
      s.brandOrCategorySuggestion.primaryMatch === 'category'
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
