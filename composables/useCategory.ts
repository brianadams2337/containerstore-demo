import { computed } from 'vue'
import { extendPromise } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { useRoute } from '#app/composables/router'
import { useCategoryById, useCategoryByPath } from '#storefront/composables'

const STORYBLOK_CATEGORIES_FOLDER = '/categories'

export function useCategory(autoFetch = false) {
  const route = useRoute()
  const { getCategoryPath } = useRouteHelpers()

  const categoryPath = computed<string>(() => getCategoryPath(route.params))

  const isStoryblokCategoryPath = categoryPath.value.startsWith(
    `${STORYBLOK_CATEGORIES_FOLDER}/`,
  )

  const baseOptions = {
    key: 'category',
    options: { autoFetch },
  }

  const useResolvedCategory = isStoryblokCategoryPath
    ? useCategoryById({
        params: {
          id: parseInt(
            categoryPath.value.replace(`${STORYBLOK_CATEGORIES_FOLDER}/`, ''),
          ),
        },
        ...baseOptions,
      })
    : useCategoryByPath({
        params: { path: categoryPath.value, children: 0 },
        ...baseOptions,
      })

  const categoryPromise = useResolvedCategory
  const { data: category, fetch } = categoryPromise

  return extendPromise(
    categoryPromise.then(() => ({})),
    {
      category,
      categoryPath,
      fetch,
    },
  )
}
