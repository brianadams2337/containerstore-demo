<template>
  <section
    ref="root"
    role="search"
    class="relative z-20 transition-all duration-150 max-lg:flex"
    :class="{
      'max-lg:px-0 lg:max-w-[475px]': hasFocus,
      'max-lg:px-3 lg:max-w-64': !hasFocus,
    }"
  >
    <form
      ref="searchBox"
      aria-haspopup="listbox"
      :tabindex="hasFocus ? -1 : 0"
      class="group flex h-11 cursor-pointer items-center gap-2 overflow-hidden border border-gray-100 px-3 transition-all duration-150 max-lg:grow lg:h-10"
      :class="{
        'bg-white lg:rounded-md': hasFocus,
        'rounded-md bg-gray-100 pr-8 hover:bg-gray-200': !hasFocus,
      }"
      @click="openAndFocus"
      @submit.prevent="goToSearchPage"
    >
      <button
        tabindex="-1"
        class="flex items-center justify-center max-lg:size-11"
      >
        <IconNewSearch class="size-5 shrink-0" />
      </button>
      <label class="flex h-full min-w-0 grow items-center gap-2">
        <input
          ref="input"
          v-model="searchQuery"
          :tabindex="hasFocus ? 0 : -1"
          type="search"
          :placeholder="$t('search.placeholder')"
          class="min-w-0 grow bg-gray-100 transition-colors placeholder-shown:truncate focus-visible:shadow-none focus-visible:outline-none"
          data-testid="header-search-input"
          :class="{
            'bg-white ': hasFocus,
            'group-hover:bg-gray-200': !hasFocus,
          }"
        />
      </label>
      <SFButton
        ref="resetButton"
        type="reset"
        variant="raw"
        class="h-6 rounded px-1.5 py-1 text-sm leading-5 text-gray-600 transition duration-150 hover:bg-gray-100 focus:bg-gray-100 focus:px-1.5"
        :class="{ hidden: !hasFocus }"
        @click.stop="resetSearch"
        @keydown.enter.stop="resetSearch"
      >
        {{ $t('global.cancel') }}
      </SFButton>
    </form>
    <SearchResultsContainer
      v-if="searchQuery.length >= 3"
      ref="resultContainer"
      :products="products"
      :categories="categories"
      :navigation-items="navigationItems"
      :search-query="searchQuery"
      :show-suggestions-loader="showSuggestionsLoader"
      @click:result="trackSuggestionClickAndClose"
      @close="closeAndReset"
    />
  </section>
</template>

<script setup lang="ts">
import { nextTick, watch, ref } from 'vue'
import { onClickOutside, onKeyStroke, useEventListener } from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type { SearchEntity } from '@scayle/storefront-nuxt'
import { useSearchData, useTrackingEvents } from '~/composables'
import SearchResultsContainer from '~/components/search/SearchResultsContainer.vue'
import { useSearchInputKeybindings } from '~/composables/useSearchInputKeybindings'
import { SFButton } from '#storefront-ui/components'

const emit = defineEmits<{
  close: []
  'click:result': [event: SearchEntity]
}>()

const {
  searchQuery,
  debouncedSearch,
  resetSearch,
  products,
  categories,
  navigationItems,
  totalCount,
  showSuggestionsLoader,
  resolveSearchAndRedirect,
} = useSearchData()

watch(
  () => searchQuery.value,
  async (query) => {
    if (!query) {
      return resetSearch()
    }
    await debouncedSearch()
  },
)

const root = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
const resultContainer = ref()
const searchBox = ref<HTMLElement>()
const resetButton = ref<HTMLButtonElement>()
const hasFocus = ref(false)

const openAndFocus = () => {
  input.value?.focus()
  hasFocus.value = true
}

const reset = async () => {
  resetSearch()
  hasFocus.value = false
  await nextTick()
  searchBox.value?.focus()
}

const closeAndReset = async () => {
  await reset()
  emit('close')
}

const { trackSearchSuggestionClick } = useTrackingEvents()
const trackSuggestionClickAndClose = (suggestion: SearchEntity) => {
  trackSearchSuggestionClick(searchQuery.value, suggestion)
  closeAndReset()
  emit('click:result', suggestion)
}

const goToSearchPage = async () => {
  if (!searchQuery.value) {
    return
  }
  await resolveSearchAndRedirect()
  closeAndReset()
}

const ARROW_KEYS = ['ArrowUp', 'ArrowDown']

onKeyStroke(
  ARROW_KEYS,
  (event: KeyboardEvent) => {
    // Prevent scrolling the page on arrow keys
    event.preventDefault()
  },
  { target: root },
)

onClickOutside(root, () => {
  if (!hasFocus.value) {
    return
  }
  reset()
})

const { activate, deactivate } = useFocusTrap(resultContainer, {
  isKeyBackward: (keyEvent) => keyEvent.code === 'ArrowUp',
  isKeyForward: (keyEvent) => keyEvent.code === 'ArrowDown',
  allowOutsideClick: true,
  returnFocusOnDeactivate: false,
})
useEventListener(resultContainer, 'focusin', () => {
  activate()
})

useSearchInputKeybindings(
  input,
  resultContainer,
  searchBox,
  resetButton,
  hasFocus,
  activate,
  deactivate,
  openAndFocus,
  reset,
  closeAndReset,
  searchQuery,
  totalCount,
)
</script>
