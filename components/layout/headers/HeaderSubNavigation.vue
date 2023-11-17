<template>
  <div
    data-test-id="nav-categories"
    class="hidden overflow-x-auto border-b border-gray-200 scrollbar-hide md:block"
  >
    <div
      v-if="!fetchingCategories"
      class="container flex items-center space-x-16"
    >
      <DefaultLink
        class="border-b-2 border-transparent py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
        :to="routeList.home"
        type="quiet"
      >
        {{ $t('global.home') }}
      </DefaultLink>
      <template v-if="Array.isArray(rootCategories)">
        <DefaultLink
          v-for="category in rootCategories"
          :key="`nav_link_${category.id}`"
          class="border-b-2 border-transparent py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
          :class="{ 'text-flamingo': category.slug === 'sale' }"
          :to="category.path"
          @mouseenter="emit('mouseenter:item', category)"
        >
          {{ category.name }}
        </DefaultLink>
      </template>

      <!-- navigation trees -->
      <template v-if="navigationTree">
        <NavigationTreeItem
          v-for="(item, idx) in navigationTree.items"
          :key="`navigation-tree-item-${idx}`"
          class="border-b-2 border-transparent py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
          :navigation-item="item"
          @mouseenter:navigation-item="emit('mouseenter:navigation-item', item)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationTree, Category } from '@scayle/storefront-nuxt'

type NavigationItem = NavigationTree['items'][0]

defineProps({
  rootCategories: {
    type: [Array, Object] as PropType<Category[] | Category>,
    required: true,
  },
  navigationTree: {
    type: Object as PropType<NavigationTree>,
    default: () => null,
  },
  fetchingCategories: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'mouseenter:item', value: Category): void
  (e: 'mouseenter:navigation-item', value: NavigationItem): void
}>()
</script>
