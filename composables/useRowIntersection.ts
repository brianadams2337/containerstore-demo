import { type Ref, computed, ref } from 'vue'
import {
  type Product,
  getRowByIndex,
  isFirstIndexOfRow,
} from '@scayle/storefront-nuxt'
import { useRoute } from '#app/composables/router'
import { useDefaultBreakpoints } from '~/composables'
import { ProductsPerRow, PRODUCTS_PER_PAGE } from '~/constants'

export function useRowIntersection(products: Ref<Product[]>) {
  const route = useRoute()
  const trackingCollector = ref<{ row: number; items: Product[] }[]>([])
  const { greaterOrEqual } = useDefaultBreakpoints()

  const isGreaterOrEqualThenLg = greaterOrEqual('lg')
  const isGreaterOrEqualThenMd = greaterOrEqual('md')

  const columns = computed(() => {
    if (isGreaterOrEqualThenLg.value) {
      return ProductsPerRow.DESKTOP
    }
    return isGreaterOrEqualThenMd.value
      ? ProductsPerRow.TABLET
      : ProductsPerRow.MOBILE
  })

  const _getRowByIndex = (index: number) => {
    const currentPage = parseInt(route.query.page as string) || 1

    return getRowByIndex(index, {
      columns: columns.value,
      page: currentPage,
      perPage: PRODUCTS_PER_PAGE,
    })
  }

  const collectRowIntersection = (index: number) => {
    const row = _getRowByIndex(index)
    const isFirstItemInRow = isFirstIndexOfRow(index, columns.value)

    const hasRowBeenTracked = trackingCollector.value.some(
      (item) => item.row === row,
    )

    if (isFirstItemInRow && !hasRowBeenTracked) {
      const itemsInRow = products.value
        .slice(index, index + columns.value)
        .map((item, idx) => ({ ...item, index: index + idx }))

      trackingCollector.value.push({ row, items: itemsInRow })

      return { row, items: itemsInRow }
    }
  }

  return {
    collectRowIntersection,
  }
}
