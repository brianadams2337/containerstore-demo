<template>
  <SFHorizontalItemsDivider :items="items" tag="SFLink" class="mt-1">
    <template #default="{ items: breadcrumbItems }">
      <SFLink
        v-for="(link, idx) in breadcrumbItems"
        :key="link.value"
        only-exact-active
        :to="link.to"
      >
        {{ link.value }}
        <template v-if="showDividerTag(idx, breadcrumbItems.length)">
          /
        </template>
      </SFLink>
    </template>
  </SFHorizontalItemsDivider>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'
import { SFHorizontalItemsDivider } from '#components'
import { showDividerTag } from '#storefront-ui'

type Link = { value: string; to: RouteLocationRaw }

defineProps<{ items: Link[] }>()
</script>
