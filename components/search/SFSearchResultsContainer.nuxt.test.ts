import { renderSuspended } from '@nuxt/test-utils/runtime'
import { expect, it, vi } from 'vitest'
import type {
  CategorySearchSuggestion,
  NavigationItemSuggestion,
  ProductSearchSuggestion,
} from '@scayle/storefront-core'
import { fireEvent } from '@testing-library/vue'
import SFSearchResultsContainer from './SFSearchResultsContainer.vue'
import {
  categorySearchSuggestionFactory,
  navigationItemSuggestionFactory,
  productSearchSuggestionFactory,
} from '~/test/factories/searchSuggestion'

vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useFormatHelpers: () => ({
      formatCurrency: (value: number) => `${value / 100}€`,
      formatPercentage: vi
        .fn()
        .mockImplementation((value: number) => `${value * 100}%`),
    }),
  }
})

const categorySuggestion: CategorySearchSuggestion[] = [
  categorySearchSuggestionFactory.build(),
]
const productSuggestion: ProductSearchSuggestion[] = [
  productSearchSuggestionFactory.build(),
]
const navigationItemSuggestion: NavigationItemSuggestion[] = [
  navigationItemSuggestionFactory.build(),
]

const getSearchResultsContainerComponent = (
  searchQuery: string,
  showSuggestionsLoader: boolean,
  categories: CategorySearchSuggestion[] = [],
  products: ProductSearchSuggestion[] = [],
  navigationItems: NavigationItemSuggestion[] = [],
) => {
  return renderSuspended(SFSearchResultsContainer, {
    props: {
      searchQuery,
      products,
      categories,
      navigationItems,
      showSuggestionsLoader,
    },
  })
}

it('should render skeleton loader', async () => {
  const { getByTestId } = await getSearchResultsContainerComponent('Test', true)
  expect(getByTestId('skeleton')).toBeInTheDocument()
})

it('should render "no results" message', async () => {
  const { getByTestId } = await getSearchResultsContainerComponent(
    'Test',
    false,
  )
  expect(getByTestId('no-result')).toBeInTheDocument()
})

it('should render suggestions', async () => {
  const { getAllByRole } = await getSearchResultsContainerComponent(
    'Test',
    false,
    categorySuggestion,
    productSuggestion,
    navigationItemSuggestion,
  )
  expect(await getAllByRole('option')).toHaveLength(4)
})

it('should emit "close" event when "display all" link was clicked', async () => {
  const { getByTestId, emitted } = await getSearchResultsContainerComponent(
    'Test',
    false,
    categorySuggestion,
    productSuggestion,
    navigationItemSuggestion,
  )
  await fireEvent.click(getByTestId('display-all-results'))
  expect(emitted()['close']).toHaveLength(1)
})

it('should emit "click:result" event when suggestion was clicked', async () => {
  const { getAllByRole, emitted } = await getSearchResultsContainerComponent(
    'Test',
    false,
    categorySuggestion,
    productSuggestion,
    navigationItemSuggestion,
  )
  const options = await getAllByRole('option')
  await Promise.all(options.map((option) => fireEvent.click(option)))
  expect(emitted()['click:result']).toHaveLength(3)
})
