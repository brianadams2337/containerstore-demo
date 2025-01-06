<template>
  <aside class="h-dvh pb-8">
    <ul class="h-full overflow-y-scroll pb-2 pl-2 scrollbar-hide">
      <li
        v-for="(category, index) in rootCategories"
        :key="`category-navigation-tree-item-${category.id}`"
        :data-testid="`root-category-${index}`"
        class="mb-5 mt-2 first:mt-0 last:mb-0"
      >
        <CategorySideNavigationItem
          :category="category"
          :is-active="category.id === currentCategory?.id"
          :is-sale="isSaleCategory(category)"
          class="font-semi-bold-variable text-gray-900"
        />
        <CategorySideNavigationChildren
          v-if="category.children?.length"
          :current-category="currentCategory"
          :sub-categories="category.children"
          :is-parent-sale="isSaleCategory(category)"
        />
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import CategorySideNavigationChildren from './CategorySideNavigationChildren.vue'
import CategorySideNavigationItem from './CategorySideNavigationItem.vue'
import { isSaleCategory } from '~/utils'

defineProps<{
  rootCategories: Category[]
  currentCategory: Category | null
  fetchingCategories: boolean
}>()
</script>
