<template>
  <div class="flex flex-col flex-wrap sm:flex-row sm:items-center">
    <div
      class="inline-flex flex-wrap"
      :class="{
        'border-r border-gray-500 max-sm:border-none md:border-r-2':
          categoryAncestors.length,
      }"
    >
      <SFLink
        v-for="({ to, value }, index) in categoryAncestors"
        :key="`breadcrumb-${value}`"
        :data-testid="`category-breadcrumb-${index}`"
        :to="to"
        raw
        class="flex items-center px-2 text-lg font-medium text-gray-500 sm:text-2xl"
        :class="{
          'border-r border-gray-500 md:border-r-2': showDividerTag(
            index,
            categoryAncestors.length,
          ),
          'pl-0': index === 0,
        }"
      >
        <span class="leading-none">{{ value }}</span>
      </SFLink>
    </div>
    <SFHeadline
      tag="h1"
      data-testid="active-category-breadcrumb"
      class="mt-1.5 !font-semi-bold-variable text-gray-900 max-sm:text-[1.5rem] max-sm:leading-6 sm:mt-0"
      :class="{ 'pl-2 max-sm:pl-0': categoryAncestors.length }"
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
import {
  SFLink,
  SFFadeInTransition,
  SFHeadline,
} from '#storefront-ui/components'
import { showDividerTag } from '#storefront-ui'

type Props = {
  category: Category
  productsCount?: number
  productsFetching?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  productsCount: undefined,
  productsFetching: false,
})

const { getBreadcrumbsFromCategory } = useBreadcrumbs()

const categoryAncestors = computed<BreadcrumbItem[]>(() => {
  return getBreadcrumbsFromCategory(props.category)
})
</script>
