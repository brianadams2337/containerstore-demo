<template>
  <HorizontalItemsDivider tag="DefaultLink" v-bind="{ items }" class="mt-1">
    <template #default="{ items: breadcrumbItems }">
      <DefaultLink
        v-for="(link, idx) in breadcrumbItems"
        :key="link.value"
        only-exact-active
        :to="link.to">
        {{ link.value }}
        <template v-if="showDividerTag(idx, breadcrumbItems.length)">
          /
        </template>
      </DefaultLink>
    </template>
  </HorizontalItemsDivider>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'

type Link = { value: string; to: RouteLocationRaw }

defineProps({
  items: {
    type: Array as PropType<Link[]>,
    required: true,
  },
})

defineOptions({ name: 'AppBreadcrumbs' })
</script>
