<template>
  <SFSlideInFromLeftTransition>
    <nav
      v-if="isSideNavigationOpen"
      class="sticky inset-1 z-[100] min-h-screen overflow-hidden overflow-y-auto overscroll-none bg-white md:hidden"
      :class="{ 'animate-pulse': fetchingCategories }"
    >
      <div class="h-full" :style="{ 'max-height': 'calc(100% - 80px)' }">
        <MobileSidebarAccountContent
          @click:hide-categories="setSideNavigationActiveState(false)"
          @click:show-categories="setSideNavigationActiveState(true)"
        />

        <div class="mt-4 flex flex-col border-b border-gray-350 px-5 pb-4">
          <MobileSearchInput
            v-model="searchQuery"
            class="mb-2"
            @focus="setMobileSearchActive(true)"
            @cancel="setMobileSearchActive(false)"
            @keydown:enter="resolveSearchAndClose"
          />
          <template v-if="isMobileSearchActive">
            <SearchResultSkeleton v-if="showSuggestionsLoader" />
            <SearchResults
              v-else-if="hasSearchQuery && !noSuggestions"
              v-bind="{ categories, products }"
              @click:result="trackSuggestionClickAndClose"
            />
            <EmptyState
              v-else-if="hasSearchQuery && noSuggestions"
              :title="$t('search.search_try_again')"
              :description="$t('search.search_try_again_description')"
              class="mt-4"
            />
            <SFFadeInTransition>
              <div v-if="totalCount" class="flex justify-center">
                <SFLink
                  class="ml-4 mt-4 border-b border-b-black"
                  @click="resolveSearchAndClose"
                >
                  {{ $t('search.more') }}
                </SFLink>
              </div>
            </SFFadeInTransition>
          </template>
        </div>

        <MobileSideNavigation
          v-if="!isMobileSearchActive && isSideNavigationActive"
          :categories="rootCategories"
          :fetching="fetchingCategories"
          show-nested-categories
          @click:navigation-item="closeSideNavigation"
        />
      </div>
    </nav>
  </SFSlideInFromLeftTransition>
</template>

<script setup lang="ts">
import type { SearchEntity } from '@scayle/storefront-nuxt'

const { isSmaller } = useDefaultBreakpoints()

const isLessThanMdBreakpoint = computed(() => isSmaller('md'))

const { rootCategories, fetchingCategories } = await useRootCategories()

const {
  closeSideNavigation,
  isSideNavigationOpen,
  isSideNavigationActive,
  setSideNavigationActiveState,
} = useSideNavigation()

const { isActive: isMobileSearchActive, setActive: setMobileSearchActive } =
  useMobileSearch()

const {
  debouncedSearch,
  hasSearchQuery,
  searchQuery,
  resetSearch,
  fetching,
  products,
  categories,
  totalCount,
  noSuggestions,
  resolveSearchAndRedirect,
  showSuggestionsLoader,
} = useSearchData()

const { trackSearchSuggestionClick } = useTrackingEvents()

const trackSuggestionClickAndClose = (suggestion: SearchEntity) => {
  trackSearchSuggestionClick(searchQuery.value, suggestion)
  resetAndClose()
}

const resolveSearchAndClose = async () => {
  await resolveSearchAndRedirect()
  resetAndClose()
}

const resetAndClose = () => {
  resetSearch()
  closeSideNavigation()
  setMobileSearchActive(false)
}

onBeforeUnmount(() => resetAndClose())

watch(searchQuery, () => {
  fetching.value = true
  debouncedSearch()
})

watch(isLessThanMdBreakpoint, (value) => !value && resetAndClose())
</script>
