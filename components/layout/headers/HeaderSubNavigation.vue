<template>
  <div
    data-testid="nav-categories"
    class="hidden overflow-x-auto border-b border-gray-200 scrollbar-hide md:block"
  >
    <div class="container flex items-center space-x-16">
      <SFLink
        class="border-b-2 border-transparent px-1 py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
        :to="routeList.home"
        type="quiet"
      >
        {{ $t('global.home') }}
      </SFLink>

      <SFLink
        v-for="category in rootCategories"
        :key="`nav-link-${category.id}`"
        :data-testid="`nav-link-${category.slug}`"
        class="border-b-2 border-transparent px-1 py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
        :class="{ 'text-flamingo': category.slug === 'sale' }"
        :to="buildCategoryPath(category)"
        @mouseenter="openFlyoutMenu(category)"
      >
        {{ category.name }}
      </SFLink>

      <template v-if="navigationTree">
        <NavigationTreeItem
          v-for="item in navigationTree.items"
          :key="`navigation-tree-item-${item.id}`"
          class="border-b-2 border-transparent px-1 py-2.5 font-normal hover:border-black sm:text-sm sm:font-semibold"
          :navigation-item="item"
          @mouseenter:navigation-item="openFlyoutMenuForNavigationTree(item)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationTree } from '@scayle/storefront-nuxt'
import { useFlyouts } from '~/composables/useFlyouts'
import { useRootCategories } from '~/composables/useRootCategories'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { routeList } from '~/utils/route'
import { SFLink } from '#storefront-ui/components'
import NavigationTreeItem from '~/components/NavigationTreeItem.vue'

withDefaults(defineProps<{ navigationTree?: NavigationTree }>(), {
  navigationTree: undefined,
})

const { rootCategories } = useRootCategories()

const { buildCategoryPath } = useRouteHelpers()

const { openFlyoutMenuForNavigationTree, openFlyoutMenu } = useFlyouts()
</script>
