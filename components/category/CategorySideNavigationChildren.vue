<template>
  <ul>
    <li
      v-for="(category, index) in subCategories"
      :key="`category-navigation-item-${category.id}`"
      :data-testid="getDataTestId(index)"
      class="mt-1"
      :class="{ 'ml-2.5': category.depth > 2 }"
    >
      <CategorySideNavigationItem
        :category="category"
        :is-active="category.id === currentCategory?.id"
        :is-sale="!isParentSale && isSaleCategory(category)"
        class="!leading-5"
        :class="{
          '!text-sm': category.depth === 2,
          '!text-xs': category.depth > 2,
        }"
      />
      <CategorySideNavigationChildren
        v-if="shouldShowChildren(category)"
        :current-category="currentCategory"
        :is-parent-sale="isSaleCategory(category)"
        :sub-categories="category.children ?? []"
        :parent-data-testid="getDataTestId(index)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
// eslint-disable-next-line import/no-self-import
import CategorySideNavigationChildren from './CategorySideNavigationChildren.vue'
import CategorySideNavigationItem from './CategorySideNavigationItem.vue'
import { isSaleCategory } from '~/utils'

const props = defineProps<{
  subCategories: Category[]
  currentCategory: Category | null
  isParentSale: boolean
  parentDataTestId?: string
}>()

const shouldShowChildren = ({ id, children }: Category) => {
  if (!children?.length) return false
  const areAncestorsActive = props.currentCategory?.rootlineIds.includes(id)
  return id === props.currentCategory?.id || areAncestorsActive
}

const getDataTestId = (index: number) => {
  return !props.parentDataTestId
    ? `sub-category-${index}`
    : `${props.parentDataTestId}_${index}`
}
</script>
