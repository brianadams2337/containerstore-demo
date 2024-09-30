<template>
  <SFSlideInFromLeftTransition>
    <nav
      v-if="isSideNavigationOpen"
      class="block-scrolling sticky z-100 h-dvh overflow-hidden overflow-y-auto overscroll-none bg-white md:hidden"
      :class="{ 'animate-pulse': fetchingCategories }"
    >
      <div class="flex h-full max-h-[calc(100%-80px)] flex-col">
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
              :categories="categories"
              :products="products"
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
                  :to="getSearchRoute(searchQuery)"
                  class="ml-4 mt-4 border-b border-b-black"
                  @click="resetAndClose"
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
import { onBeforeUnmount, watch } from 'vue'
import type { SearchEntity } from '@scayle/storefront-nuxt'
import MobileSearchInput from '../headers/search/MobileSearchInput.vue'
import MobileSidebarAccountContent from './MobileSidebarAccountContent.vue'
import MobileSideNavigation from './MobileSideNavigation.vue'
import SearchResults from '~/components/search/SearchResults.vue'
import EmptyState from '~/components/EmptyState.vue'
import SearchResultSkeleton from '~/components/search/SearchResultSkeleton.vue'
import {
  useDefaultBreakpoints,
  useMobileSearch,
  useRootCategories,
  useRouteHelpers,
  useSearchData,
  useSideNavigation,
  useTrackingEvents,
} from '~/composables'
import {
  SFFadeInTransition,
  SFSlideInFromLeftTransition,
  SFLink,
} from '#storefront-ui/components'

const { getSearchRoute } = useRouteHelpers()

const { smaller } = useDefaultBreakpoints()

const { rootCategories, fetchingCategories } = useRootCategories()

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

watch(smaller('md'), (value) => !value && resetAndClose())
</script>
