<template>
  <NuxtPage
    :root-categories="rootCategories"
    :fetching-categories="fetchingCategories"
    :all-categories="allCategories"
  ></NuxtPage>
</template>

<script setup lang="ts">
import { NuxtPage } from '#components'
import { useRootCategories } from '~/composables/useRootCategories'

const { rootCategories, fetchingCategories, allCategories } = useRootCategories(
  {
    key: 'category-navigation-tree',
    children: 5,
  },
)
</script>
