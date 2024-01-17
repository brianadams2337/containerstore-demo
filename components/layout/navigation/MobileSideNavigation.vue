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
        <IconBack class="mr-1 size-3" />
        <p>Back to "{{ activeParentCategory.name }}"</p>
      </div>
      <ul class="my-4">
        <li
          v-for="child in activeParentCategory.children"
          :key="`side_navigation_list_item_mb_${child.id}`"
          class="mb-3 ml-0 px-5 last:mb-0"
          @click="emit('click:navigationItem')"
        >
          <DefaultLink :to="child.path"> {{ child.name }}</DefaultLink>
        </li>
      </ul>
    </div>
    <div v-else>
      <DefaultLink
        v-if="rootCategory"
        class="mb-4 px-12 !text-xl !font-bold"
        only-exact-active
        :to="rootCategory.path"
      >
        {{ rootCategory.name }}
      </DefaultLink>
      <ul v-if="categories?.length" class="my-4 md:mt-0">
        <li
          v-for="category in categories"
          :key="`side_navigation_list_item_${category.id}`"
          class="mb-3 ml-0 px-5 last:mb-0 md:ml-3 md:px-12"
          :class="{ 'text-pink-neon': category.path === '/sale' }"
          @click="setActiveParentCategory(category)"
        >
          <DefaultLink class="text-base" :to="category.path">
            {{ category.name }}
          </DefaultLink>
        </li>
      </ul>
      <DefaultLink
        v-if="rootCategory && rootCategory.path !== '/sale'"
        class="px-12 !text-xl text-pink-neon"
        only-exact-active
        to="/sale"
      >
        Sale
      </DefaultLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'

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

const pathParts = computed(() => route.path.split('/'))

const isNestedCategoryViewActive = computed(() => pathParts.value.length > 2)

activeParentCategory.value = props.categories.find(({ path }) => {
  return path === `/${pathParts.value[0]}`
})

const setActiveParentCategory = (category: Category) => {
  activeParentCategory.value = category
  return !category.children?.length && emit('click:navigationItem')
}
</script>
