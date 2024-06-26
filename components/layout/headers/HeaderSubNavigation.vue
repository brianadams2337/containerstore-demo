<template>
  <div
    data-test-id="nav-categories"
    class="hidden overflow-x-auto border-b border-gray-200 scrollbar-hide md:block"
  >
    <div
      v-if="!fetchingCategories"
      class="container flex items-center space-x-16"
    >
      <SFLink
        class="border-b-2 border-transparent py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
        :to="routeList.home"
        type="quiet"
      >
        {{ $t('global.home') }}
      </SFLink>

      <SFLink
        v-for="category in rootCategories"
        :key="`nav-link-${category.id}`"
        :data-test-id="`nav-link-${category.id}`"
        class="border-b-2 border-transparent py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
        :class="{ 'text-flamingo': category.slug === 'sale' }"
        :to="category.path"
        @mouseenter="openFlyoutMenu(category)"
      >
        {{ category.name }}
      </SFLink>

      <template v-if="navigationTree">
        <NavigationTreeItem
          v-for="item in navigationTree.items"
          :key="`navigation-tree-item-${item.id}`"
          class="border-b-2 border-transparent py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
          :navigation-item="item"
          @mouseenter:navigation-item="openFlyoutMenuForNavigationTree(item)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationTree } from '@scayle/storefront-nuxt'
import { useFlyouts, useRootCategories } from '~/composables'
import { routeList } from '~/utils/route'

withDefaults(defineProps<{ navigationTree?: NavigationTree }>(), {
  navigationTree: undefined,
})

const { rootCategories, fetchingCategories } = useRootCategories()

const { openFlyoutMenuForNavigationTree, openFlyoutMenu } = useFlyouts()
</script>
