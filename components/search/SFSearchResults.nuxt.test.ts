import { renderSuspended } from '@nuxt/test-utils/runtime'
import { expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import SFSearchResults from './SFSearchResults.vue'
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

const getSearchResultsComponent = () => {
  return renderSuspended(SFSearchResults, {
    props: {
      categories: [categorySearchSuggestionFactory.build()],
      products: [productSearchSuggestionFactory.build()],
      navigationItems: [navigationItemSuggestionFactory.build()],
      searchTerm: 'Search',
    },
  })
}

it('should render all suggestions', async () => {
  const { getByText, getAllByRole, getByRole } =
    await getSearchResultsComponent()
  expect(getByRole('listbox')).toBeInTheDocument()
  expect(await getAllByRole('option')).toHaveLength(4)
  expect(getByText('Kategorien')).toBeInTheDocument()
  expect(getByText('Produkte')).toBeInTheDocument()
  expect(getByText('Seiten')).toBeInTheDocument()
  expect(
    getByRole('option', { name: 'Alle Ergebnisse für Search anzeigen' }),
  ).toBeInTheDocument()
})

it('should emit "click" result event when option was clicked', async () => {
  const { emitted, getAllByRole } = await getSearchResultsComponent()
  const options = await getAllByRole('option')
  await Promise.all(options.map((option) => fireEvent.click(option)))
  expect(emitted()['click:result']).toHaveLength(3)
  expect(emitted()['close']).toHaveLength(1)
})
