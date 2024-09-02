<template>
  <div>
    <SFLink
      v-for="(
        { categoryName, categoryUrl, categoryId }, index
      ) in productCategories"
      :key="`breadcrumb-${categoryName}`"
      :data-testid="`category-breadcrumb-${index}`"
      :to="
        buildCategoryPath({
          id: categoryId,
          path: categoryUrl,
        })
      "
      raw
      class="px-2"
      :class="{
        'border-r border-gray-500 md:border-r': showDividerTag(
          index,
          productCategories.length,
        ),
        'pl-0': index === 0,
      }"
    >
      <span
        class="text-md leading-none text-gray-500 transition-all hover:text-black"
        >{{ categoryName }}</span
      >
    </SFLink>
  </div>
</template>

<script setup lang="ts">
import type { ProductCategory } from '@scayle/storefront-nuxt'
import { SFLink } from '#components'
import { useRouteHelpers } from '~/composables'
import { showDividerTag } from '#storefront-ui'

type Props = {
  productCategories: ProductCategory[]
}

defineProps<Props>()
const { buildCategoryPath } = useRouteHelpers()
</script>
