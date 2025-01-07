<template>
  <div class="mr-auto text-gray-900">
    {{ $t('footer.copyright', { current_year: new Date().getFullYear() }) }}
  </div>
  <ul class="flex flex-row gap-4 text-gray-600 md:contents">
    <li v-for="navItem in footerTree?.items" :key="`footer-link-${navItem.id}`">
      <SFNavigationTreeItem
        class="rounded-md hover:bg-gray-100 md:p-1"
        raw
        :navigation-item="navItem"
      />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useNavigationTreeByName } from '#storefront/composables'
import SFNavigationTreeItem from '~/components/SFNavigationTreeItem.vue'

const { data: footerTree } = useNavigationTreeByName(
  {
    params: { treeName: 'Simplified Footer' },
  },
  'simple-footer-tree',
)
</script>
