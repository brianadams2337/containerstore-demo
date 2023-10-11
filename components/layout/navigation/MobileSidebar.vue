<template>
  <SlideInFromLeftTransition>
    <nav
      v-if="isSideNavigationOpen"
      class="sticky inset-1 z-50 min-h-screen overflow-hidden overflow-y-auto overscroll-none bg-white"
      :class="{ 'animate-pulse': fetchingCategories }">
      <div class="h-full" :style="{ 'max-height': 'calc(100% - 80px)' }">
        <MobileSidebarAccountContent
          @click:hide-categories="sideNavigationActive = false"
          @click:show-categories="sideNavigationActive = true" />

        <div class="mt-4 flex flex-col border-b border-gray-350 px-5 pb-4">
          <MobileSearchInput
            v-model="searchQuery"
            @focus="setMobileSearchIsActive(true)"
            @cancel="setMobileSearchIsActive(false)"
            @click:close="resetAndClose"
            @keydown:enter="openSearchPage" />
          <template v-if="mobileSearchIsActive">
            <Headline
              v-if="totalCount > 0 && !searching"
              class="my-4"
              size="sm">
              {{
                $t('search.search_term_match_count', {
                  count: products.length,
                  term: searchQuery,
                })
              }}
            </Headline>
            <SearchResultSkeleton v-if="searching" />
            <NuxtLazyHydrate v-else-if="validInput && !noSuggestions">
              <SearchResults
                :product-suggestions="products"
                :categories="categories"
                :fetching="searching"
                :show-labels="false"
                :results-count="totalCount"
                :term="searchQuery"
                @click:result="trackSuggestionClickAndClose" />
            </NuxtLazyHydrate>
            <div v-else-if="validInput && noSuggestions" class="mt-4">
              <EmptyState
                :title="$t('search.search_try_again')"
                :description="$t('search.search_try_again_description')" />
            </div>
            <FadeInTransition>
              <div v-if="totalCount" class="flex justify-center">
                <DefaultLink
                  class="ml-4 mt-4 border-b border-b-black"
                  :to="getSearchRoute(searchQuery)"
                  @click="openSearchPage">
                  {{ $t('search.more') }}
                </DefaultLink>
              </div>
            </FadeInTransition>
          </template>
        </div>

        <MobileSideNavigation
          v-if="!mobileSearchIsActive && sideNavigationActive"
          :categories="rootCategories"
          :fetching="fetchingCategories"
          show-nested-categories
          @click:navigation-item="closeSideNavigation" />
      </div>
    </nav>
  </SlideInFromLeftTransition>
</template>

<script setup lang="ts">
import {
  Category,
  BrandOrCategorySuggestion,
  ProductSuggestion,
} from '@scayle/storefront-nuxt'
import { DEBOUNCED_SEARCH_DURATION, MIN_CHARS_FOR_SEARCH } from '~/constants'

defineProps({
  rootCategories: {
    type: [Array, Object] as PropType<Category[] | Category>,
    default: () => [],
  },
  fetchingCategories: {
    type: Boolean,
    required: true,
  },
})

const sideNavigationActive = ref(true)

const router = useRouter()

const {
  closeSideNavigation,
  isSideNavigationOpen,
  setMobileSearchIsActive,
  mobileSearchIsActive,
} = useUiState()

const {
  data,
  search,
  searchQuery,
  resetSearch,
  pending: searching,
} = useSearch({ key: 'header-search' })

const { trackSearchSuggestionClick } = useTrackingEvents()

const { products, categories, totalCount, noSuggestions } =
  useTypeaheadSuggestions(data)

const trackSuggestionClickAndClose = (
  suggestion: ProductSuggestion | BrandOrCategorySuggestion,
) => {
  trackSearchSuggestionClick(searchQuery.value, suggestion)
  resetAndClose()
}

const openSearchPage = async () => {
  await router.push(toLocalePath(getSearchRoute(searchQuery.value)))
  resetAndClose()
}

const resetAndClose = () => {
  resetSearch()
  closeSideNavigation()
  setMobileSearchIsActive(false)
}

onBeforeUnmount(() => resetAndClose())

const validInput = computed(() => {
  return (searchQuery.value?.length || 0) >= MIN_CHARS_FOR_SEARCH
})

const debouncedSearch = useDebounce(
  { delay: DEBOUNCED_SEARCH_DURATION },
  async () => {
    if (!validInput.value) {
      searching.value = false
      return
    }
    await search({ term: searchQuery.value })
  },
)

watch(searchQuery, () => {
  searching.value = true
  debouncedSearch()
})
</script>
