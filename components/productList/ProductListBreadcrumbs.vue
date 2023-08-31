<template>
  <HorizontalItemsDivider
    v-if="breadcrumbs.length"
    :items="breadcrumbs"
    align-items="start">
    <template #default="{ items }">
      <template
        v-for="(link, idx) in asCrumbs(items)"
        :key="`breadcrumb-${idx}`">
        <DefaultLink
          :to="link.to"
          size="sm"
          type="quieter"
          class="capitalize hover:underline"
          only-exact-active>
          <Headline v-if="isActive(link.to)" size="sm" :is-uppercase="false">
            {{ link.value }}
          </Headline>
          <template v-else>
            {{ link.value }}
          </template>
          <span
            v-if="showDividerTag(idx, items.length)"
            :key="`span-${link.value}`"
            class="-ml-1 text-sm font-light">
            /
          </span>
        </DefaultLink>
      </template>
    </template>
  </HorizontalItemsDivider>
</template>

<script setup lang="ts">
import { BreadcrumbItem, getBreadcrumbsFromPath } from '@scayle/storefront-nuxt'

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  return getBreadcrumbsFromPath(route.path)
})

const isActive = (url: string) => {
  return isExactActiveRoute(route, url, { ignoreQuery: false })
}

const asCrumbs = (items: any) => items as BreadcrumbItem[]

const showDividerTag = (index: number, arrayLength: number) => {
  return index >= 0 && arrayLength > 1 && index < arrayLength - 1
}
</script>
