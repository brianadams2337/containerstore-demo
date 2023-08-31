<template>
  <div v-if="fetching" class="mt-8">
    <SideNavigationSkeleton
      v-for="index in 5"
      :key="`category-loading-${index}`"
      :index="index" />
  </div>
  <div v-else class="mr-4" :class="{ 'animate-pulse': fetching }">
    <div>
      <DefaultLink
        v-if="rootCategory"
        class="mb-4 px-12 !text-xl !font-bold"
        only-exact-active
        :to="rootCategory.path">
        {{ rootCategory.name }}</DefaultLink
      >
      <ul
        v-if="'length' in categories && categories.length"
        class="my-4 md:mt-0">
        <li
          v-for="category in categories"
          :key="`side_navigation_list_item_${category.id}`"
          class="mb-3 ml-0 px-5 last:mb-0 md:ml-3 md:px-12"
          :class="{ 'text-pink-neon': category.path === '/sale' }"
          @click="emit('click:navigationItem')">
          <DefaultLink class="text-base" :to="category.path">
            {{ category.name }}</DefaultLink
          >
          <ul
            v-if="showNestedCategories && category.children?.length"
            class="my-4">
            <li
              v-for="child in category.children"
              :key="`side_navigation_list_item_${child.id}`"
              class="mb-3 ml-3 last:mb-0">
              <DefaultLink class="!text-sm" :to="child.path">
                {{ child.name }}</DefaultLink
              >
            </li>
          </ul>
        </li>
      </ul>
      <DefaultLink
        v-if="rootCategory && rootCategory.path !== '/sale'"
        class="text-pink-neon px-12 !text-xl"
        only-exact-active
        to="/sale">
        Sale</DefaultLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { Category } from '@scayle/storefront-nuxt'

defineProps({
  categories: {
    type: [Array, Object] as PropType<Category[] | Category>,
    default: () => [],
  },
  fetching: {
    type: Boolean,
    required: true,
  },
  rootCategory: {
    type: Object as PropType<Category>,
    default: null,
  },
  showNestedCategories: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'click:navigationItem'): void
}>()
</script>
