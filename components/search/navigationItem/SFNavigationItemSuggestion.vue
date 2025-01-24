<template>
  <SFNavigationTreeItem
    :navigation-item="
      navigationItemSuggestion.navigationItemSuggestion.navigationItem
    "
    raw
    class="block cursor-pointer space-y-2 rounded-lg border border-gray-600 p-4 hover:border-gray-900 hover:bg-gray-100 focus:border-gray-900 focus:bg-gray-100"
    @click="emit('click:result', navigationItemSuggestion)"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="text-gray-600" :aria-label="navigationName" v-html="title" />
  </SFNavigationTreeItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DOMpurify from 'dompurify'
import type { NavigationItemSuggestion } from '@scayle/storefront-nuxt'
import SFNavigationTreeItem from '~/components/SFNavigationTreeItem.vue'

type Props = {
  navigationItemSuggestion: NavigationItemSuggestion
  searchTerm?: string
}
const { navigationItemSuggestion, searchTerm = '' } = defineProps<Props>()
const emit = defineEmits<{
  (e: 'click:result', suggestion: NavigationItemSuggestion): void
}>()

const navigationName = computed(
  () => navigationItemSuggestion.navigationItemSuggestion.navigationItem.name,
)

const title = computed(() => {
  if (!searchTerm) {
    return navigationName.value
  }

  const regex = new RegExp(searchTerm.replaceAll(' ', '|'), 'gi')
  return DOMpurify.sanitize(
    navigationName.value.replace(
      regex,
      '<span class="font-semibold">$&</span>',
    ),
    {
      ALLOWED_TAGS: ['span'],
    },
  )
})
</script>
