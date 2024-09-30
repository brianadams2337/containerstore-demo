<template>
  <div v-if="fetching" class="mt-8">
    <SFSkeletonLoader
      v-for="index in 5"
      :key="`category-loading-${index}`"
      :index="index"
    />
  </div>
  <div v-else class="mr-4" :class="{ 'animate-pulse': fetching }">
    <div
      v-if="
        isNestedCategoryViewActive && activeParentCategory?.children?.length
      "
    >
      <div class="mb-5 ml-5 mt-6 flex items-center text-xs">
        <SFLink :to="routeList.home" @click="handleGoBack">
          <IconBack class="mr-1 size-3" />
          <p>{{ $t('global.back') }}</p>
        </SFLink>
      </div>
      <ul class="my-4">
        <li
          v-for="subCategory in activeParentCategory.children"
          :key="`side-navigation-list-item-mb-${subCategory.id}`"
          class="mb-3 ml-0 px-5 last:mb-0"
          :data-testid="`side-navigation-list-subitem-${subCategory.id}`"
          @click="emit('click:navigationItem')"
          @keydown.enter="emit('click:navigationItem')"
        >
          <SFLink :to="buildCategoryPath(subCategory)">
            {{ subCategory.name }}
          </SFLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <SFLink
        v-if="rootCategory"
        class="mb-4 px-12 !text-xl !font-bold"
        only-exact-active
        :to="buildCategoryPath(rootCategory)"
      >
        {{ rootCategory.name }}
      </SFLink>
      <ul v-if="categories?.length" class="my-4 md:mt-0">
        <li
          v-for="category in categories"
          :key="`side-navigation-list-item-${category.id}`"
          class="mb-3 ml-0 px-5 last:mb-0 md:ml-3 md:px-12"
          :data-testid="`side-navigation-list-item-${category.id}`"
          :class="{ 'text-pink-neon': category.path === '/sale' }"
          @click="setActiveParentCategory(category)"
          @keydown.enter="setActiveParentCategory(category)"
        >
          <SFLink class="text-base" :to="buildCategoryPath(category)">
            {{ category.name }}
          </SFLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Category } from '@scayle/storefront-nuxt'
import { useRoute } from '#app/composables/router'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { routeList } from '~/utils/route'
import { SFLink, SFSkeletonLoader } from '#storefront-ui/components'

type Props = {
  categories?: Category[]
  rootCategory?: Category
  fetching: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  rootCategory: undefined,
})

const emit = defineEmits<{ 'click:navigationItem': [] }>()

const { buildCategoryPath } = useRouteHelpers()

const route = useRoute()
const activeParentCategory = ref<Category>()

function getPathParts(path: string) {
  return path.split('/').filter(Boolean)
}

const currentPathParts = computed(() => getPathParts(route.path))

const isNestedCategoryViewActive = computed(() => {
  const depth = activeParentCategory.value?.depth
  return depth && depth > 0
})

const handleGoBack = () => setActiveParentCategory(undefined)

activeParentCategory.value = props.categories.find(({ path }) => {
  if (currentPathParts.value.length < 2) {
    return
  }
  const rootCategoryPathParts = getPathParts(path)

  return (
    rootCategoryPathParts[rootCategoryPathParts.length - 1] ===
    currentPathParts.value[currentPathParts.value.length - 2]
  )
})

const setActiveParentCategory = (category?: Category) => {
  activeParentCategory.value = category
  if (category) {
    return !category.children?.length && emit('click:navigationItem')
  }
  return emit('click:navigationItem')
}
</script>
