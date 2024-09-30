<template>
  <SFItemsSlider
    class="w-full snap-x snap-mandatory scrollbar-hide"
    slider-class="px-4"
  >
    <CategoryNavigationSliderItem
      v-for="category in categories"
      :key="category.id"
      :category="category"
      :is-active="category.id === currentCategory?.id"
      class="mr-2"
    />
  </SFItemsSlider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@scayle/storefront-nuxt'
import CategoryNavigationSliderItem from './CategoryNavigationSliderItem.vue'
import { SFItemsSlider } from '#storefront-ui/components'

const props = defineProps<{
  allCategories: Category[]
  currentCategory: Category | null
}>()

const categories = computed(() => {
  const currentCategory = props.currentCategory

  // If the category is a leaf node, select all categories which have the same parent
  if (currentCategory?.childrenIds.length === 0) {
    return props.allCategories.filter((item) => {
      return currentCategory.parentId === item.parentId
    })
  }

  // If the category has children, we return all categories which have our current category as a parent
  return props.allCategories.filter((item) => {
    return currentCategory?.id === item.parentId
  })
})
</script>
