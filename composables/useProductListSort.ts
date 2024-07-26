import {
  APISortOption,
  APISortOrder,
  type ProductSortConfig,
} from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { useRoute } from '#app/composables/router'
import { useI18n } from '#i18n'

export const DEFAULT_SORTING_KEY = 'date_newest'

const sortingOptions: Record<string, ProductSortConfig> = {
  top_seller: {
    by: APISortOption.Price,
    direction: APISortOrder.Ascending,
  },
  date_newest: {
    by: APISortOption.DateAdded,
  },
  price_desc: {
    by: APISortOption.Price,
    direction: APISortOrder.Descending,
  },
  price_asc: {
    by: APISortOption.Price,
    direction: APISortOrder.Ascending,
  },
  reduction_desc: {
    by: APISortOption.Reduction,
    direction: APISortOrder.Descending,
  },
}

type SelectedSort = ProductSortConfig & { key: string; label: string }

export function useProductListSort() {
  const route = useRoute()
  const { t } = useI18n()

  const selectedSort = computed<SelectedSort>(() => {
    const sort = route.query.sort as string

    if (!sort || !(sort in sortingOptions)) {
      return {
        key: DEFAULT_SORTING_KEY,
        label: t(`sorting_select.${DEFAULT_SORTING_KEY}`),
        ...sortingOptions[DEFAULT_SORTING_KEY],
      }
    }
    const label = t(`sorting_select.${sort}`)

    return { key: sort, label, ...sortingOptions[sort] }
  })

  const sortLinks = computed(() => {
    const links = []
    for (const key in sortingOptions) {
      links.push({
        key,
        ...sortingOptions[key],
        to: {
          path: route.path,
          query: { ...route.query, sort: key },
        },
        label: t(`sorting_select.${key}`),
      })
    }
    return links
  })

  const isDefaultSortSelected = computed(() => {
    return selectedSort.value.key === DEFAULT_SORTING_KEY
  })

  return {
    selectedSort,
    sortLinks,
    isDefaultSortSelected,
  }
}
