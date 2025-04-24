<template>
  <div class="mr-auto text-gray-900" data-testid="footer-copyright">
    {{ $t('footer.copyright', { currentYear: new Date().getFullYear() }) }}
  </div>
  <ul class="flex flex-row gap-4 text-gray-600 md:contents">
    <li v-for="navItem in footerTree?.items" :key="`footer-link-${navItem.id}`">
      <SFNavigationTreeItem
        class="rounded-md hover:bg-gray-100 md:p-1"
        data-testid="simple-footer-link"
        raw
        :navigation-item="navItem"
      />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useSimpleFooterNavigation } from '#storefront-navigation/composables'
import SFNavigationTreeItem from '~/components/SFNavigationTreeItem.vue'

const { data: footerTree } = useSimpleFooterNavigation()
</script>
