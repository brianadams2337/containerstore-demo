<template>
  <div class="flex flex-col flex-wrap sm:flex-row sm:items-center">
    <div class="inline-flex flex-wrap">
      <SFLink
        v-for="({ to, value }, index) in categoryAncestors"
        :key="`breadcrumb-${value}`"
        :data-testid="`category-breadcrumb-${index}`"
        :to="to"
        raw
        class="flex items-center text-lg font-medium text-gray-500 sm:text-2xl"
      >
        <span>{{ value }}</span>
        <span
          v-if="showDividerTag(index, categoryAncestors.length)"
          class="mx-2 text-2xl font-light"
        >
          {{ divider }}
        </span>
      </SFLink>
    </div>
    <span
      v-if="categoryAncestors.length"
      class="mx-2 text-2xl font-light max-sm:hidden"
    >
      {{ divider }}
    </span>
    <SFHeadline
      tag="h1"
      data-testid="active-category-breadcrumb"
      class="mt-1.5 !font-semi-bold-variable text-gray-900 max-sm:text-[1.5rem] max-sm:leading-6 sm:mt-0"
    >
      {{ category.name }}
      <SFFadeInTransition>
        <span
          v-if="!productsFetching && productsCount !== undefined"
          class="ml-0.5 inline-flex h-[1.125rem] items-center rounded-[1.25rem] bg-gray-900 px-2 text-xs font-semibold leading-4 text-white"
          data-testid="breadcrumb-product-counter"
        >
          {{ productsCount }}
        </span>
      </SFFadeInTransition>
    </SFHeadline>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import type { BreadcrumbItem } from '~/types/breadcrumbs'
import { useBreadcrumbs } from '~/composables'
import { SFLink } from '#components'
import { showDividerTag } from '#storefront-ui'

type Props = {
  category: Category
  divider?: '/' | '|'
  productsCount?: number
  productsFetching?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  divider: '|',
  productsCount: undefined,
  productsFetching: false,
})

const { getBreadcrumbsFromCategory } = useBreadcrumbs()

const categoryAncestors = computed<BreadcrumbItem[]>(() => {
  return getBreadcrumbsFromCategory(props.category)
})
</script>
