<template>
  <div v-if="fetching" class="mt-8">
    <SideNavigationSkeleton
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
          v-for="child in activeParentCategory.children"
          :key="`side_navigation_list_item_mb_${child.id}`"
          class="mb-3 ml-0 px-5 last:mb-0"
          @click="emit('click:navigationItem')"
        >
          <SFLink :to="child.path"> {{ child.name }}</SFLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <SFLink
        v-if="rootCategory"
        class="mb-4 px-12 !text-xl !font-bold"
        only-exact-active
        :to="rootCategory.path"
      >
        {{ rootCategory.name }}
      </SFLink>
      <ul v-if="categories?.length" class="my-4 md:mt-0">
        <li
          v-for="category in categories"
          :key="`side_navigation_list_item_${category.id}`"
          class="mb-3 ml-0 px-5 last:mb-0 md:ml-3 md:px-12"
          :class="{ 'text-pink-neon': category.path === '/sale' }"
          @click="setActiveParentCategory(category)"
        >
          <SFLink class="text-base" :to="category.path">
            {{ category.name }}
          </SFLink>
        </li>
      </ul>
      <SFLink
        v-if="rootCategory && rootCategory.path !== '/sale'"
        class="px-12 !text-xl text-pink-neon"
        only-exact-active
        to="/sale"
      >
        Sale
      </SFLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Category } from '@scayle/storefront-nuxt'
import { useRoute } from '#app/composables/router'
import { routeList } from '~/utils/route'

type Props = {
  categories?: Category[]
  rootCategory?: Category
  fetching: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  rootCategory: undefined,
})

const emit = defineEmits<{ (e: 'click:navigationItem'): void }>()

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

function handleGoBack() {
  setActiveParentCategory(undefined)
}
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
