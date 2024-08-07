<template>
  <div
    class="relative z-30 h-12 rounded border border-primary/0 transition-all duration-500"
    :class="inputActive ? 'w-[21rem] border-primary/100' : 'w-12 delay-100'"
    @keydown.esc="closeInput"
  >
    <label class="sr-only">{{ $t('search.placeholder') }}</label>
    <button
      data-testid="header-search-button"
      aria-label="Open search input"
      @click="inputActive = true"
    >
      <IconSearchBold
        aria-hidden="true"
        class="absolute inset-y-2.5 left-2 size-6"
        :class="inputActive ? 'pointer-events-none' : 'cursor-pointer'"
      />
    </button>

    <SFFadeInTransition :duration="100">
      <SFButton
        v-if="searchQuery"
        type="raw"
        aria-label="Close search input"
        data-test-id="close-search-button"
        class="absolute right-0 flex h-full cursor-pointer items-center justify-center px-2.5 py-2"
      >
        <IconClose
          aria-hidden="true"
          class="size-4"
          @click="resetSearch"
          @mousedown.prevent
        />
      </SFButton>
    </SFFadeInTransition>
    <input
      ref="input"
      v-model="searchQuery"
      :placeholder="$t('search.placeholder')"
      data-testid="header-search-input"
      type="search"
      autocomplete="off"
      class="w-full appearance-none overflow-hidden rounded border border-none border-transparent py-3 pl-10 pr-4 text-sm font-medium outline-none search-decoration-none focus:ring-0"
      :class="{
        'pr-10': searchQuery,
        'w-0': !inputActive,
      }"
      @focus="showSuggestions = true"
      @keydown.enter="resolveSearchAndClose"
    />

    <SFFlyout ref="suggestionsFlyout" :is-open="isFlyoutOpened">
      <SearchResultsContainer
        v-if="showSuggestions"
        data-testid="search-results-flyout"
        @close="closeInput"
        @click:result="trackSuggestionClickAndClose"
      />
    </SFFlyout>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { onClickOutside } from '@vueuse/core'
import type { SearchEntity } from '@scayle/storefront-nuxt'
import { useSearchData, useTrackingEvents } from '~/composables'

const {
  debouncedSearch,
  searchQuery,
  resetSearch,
  totalCount,
  resolveSearchAndRedirect,
} = useSearchData()

const { trackSearchSuggestionClick } = useTrackingEvents()

const suggestionsFlyout = ref<HTMLElement | null>(null)
const input = ref<HTMLElement | null>(null)
const showSuggestions = ref(false)
const inputActive = ref(false)

const closeInput = () => {
  inputActive.value = false
}

onClickOutside(input, closeInput, { ignore: [suggestionsFlyout] })
watch(inputActive, (active) => (active ? input.value?.focus() : resetSearch()))

watch(
  () => searchQuery.value,
  (query) => {
    if (!query) {
      return resetSearch()
    }
    inputActive.value = true
    debouncedSearch()
  },
)

watchEffect(() => {
  showSuggestions.value = !!searchQuery.value.length
})

const trackSuggestionClickAndClose = (suggestion: SearchEntity) => {
  trackSearchSuggestionClick(searchQuery.value, suggestion)
  closeInput()
}

const resolveSearchAndClose = async () => {
  await resolveSearchAndRedirect()
  closeInput()
}

const isFlyoutOpened = computed(() => !!totalCount.value)
</script>
