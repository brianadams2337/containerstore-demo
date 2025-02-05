<!-- eslint-disable vue/no-v-html -->
<template>
  <SFLocalizedLink
    data-testid="display-all-results"
    :to="getSearchRoute(searchTerm)"
    :aria-label="showMoreAriaLabel"
    class="h-11 rounded transition-all duration-150 hover:right-1 hover:bg-gray-100 hover:px-1.5 focus:bg-gray-100 focus:px-1.5 lg:h-5"
  >
    <span
      class="text-md font-normal leading-5 text-gray-600 max-lg:py-3 lg:text-base"
      v-html="showMoreLabel"
    />
  </SFLocalizedLink>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import DOMpurify from 'dompurify'
import { useRouteHelpers } from '~/composables'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'

const { searchTerm } = defineProps<{ searchTerm: string }>()

const { getSearchRoute } = useRouteHelpers()

const { t } = useI18n()

const showMoreLabel = computed(() => {
  const regex = new RegExp(searchTerm.replaceAll(' ', '|'), 'gi')
  return DOMpurify.sanitize(
    t('search.search_results', { searchTerm }).replace(
      regex,
      '<span class="font-semibold">$&</span>',
    ),
    {
      ALLOWED_TAGS: ['span'],
    },
  )
})
const showMoreAriaLabel = computed(() => {
  return DOMpurify.sanitize(t('search.search_results', { searchTerm }))
})
</script>
