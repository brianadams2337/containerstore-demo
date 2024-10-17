<template>
  <CMSAppFooterData>
    <template #promises>
      <FooterPromises />
    </template>
    <template #navigation-tree-items>
      <div
        v-for="{ id, name, items } in navigationTreeItems"
        :key="`footer-navigation-tree-${id}`"
        class="flex flex-col"
      >
        <h5 class="mb-3 text-sm font-bold">
          {{ name }}
        </h5>
        <NavigationTreeItem
          v-for="tree in items"
          :key="`footer-navigation-sub-tree-${tree.id}`"
          :navigation-item="tree"
          class="block py-2 text-xs font-semibold !leading-4 text-gray-750 md:py-1"
        />
      </div>
    </template>
  </CMSAppFooterData>
</template>

<script setup lang="ts">
import CMSAppFooterData from '#storefront-cms/components/fetching/CMSAppFooterData.vue'
import FooterPromises from '~/components/layout/footer/FooterPromises.vue'
import NavigationTreeItem from '~/components/NavigationTreeItem.vue'
import { useNavigationTreeItems } from '~/composables/useNavigationTreeItems'

const { navigationTreeItems } = useNavigationTreeItems('footer')
</script>
