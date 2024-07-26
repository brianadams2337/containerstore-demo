<template>
  <SFButton
    type="raw"
    fab
    size="sm"
    class="size-10 border border-gray-200 text-gray-500"
    :aria-label="$t('plp.back_navigation_button_label')"
    :to="link"
  >
    <template #append-icon="{ _class }">
      <IconChevronLeft :class="_class" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables'
import { routeList } from '~/utils'

const props = defineProps<{ currentCategory: Category }>()

const { buildCategoryPath } = useRouteHelpers()

const link = computed(() => {
  return props.currentCategory.parent
    ? buildCategoryPath(props.currentCategory.parent)
    : routeList.home.path
})
</script>
