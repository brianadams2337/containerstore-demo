<template>
  <SFHorizontalItemsDivider tag="SFLink" :items="breadcrumbs">
    <template #default="{ items }">
      <SFLink
        v-for="({ value, to }, idx) in items"
        :key="value"
        raw
        class="inline text-sm font-light uppercase leading-5"
        data-test-id="categoryOnProductDetailPage"
        :to="to"
      >
        {{ value }}
        <template v-if="showDividerTag(idx, items.length)">/</template>
      </SFLink>
    </template>
  </SFHorizontalItemsDivider>
</template>

<script
  setup
  lang="ts"
  generic="Link extends { value: string; to: RouteLocationRaw }"
>
import { SFHorizontalItemsDivider } from '#components'
import type { RouteLocationRaw } from '#vue-router'
import { showDividerTag } from '#storefront-ui'

defineProps<{ breadcrumbs: Link[] }>()
</script>
