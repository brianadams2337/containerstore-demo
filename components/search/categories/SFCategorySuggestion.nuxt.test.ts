import { expect, it } from 'vitest'
import type { Category } from '@scayle/storefront-core'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent } from '@testing-library/vue'
import SFCategorySuggestion from './SFCategorySuggestion.vue'
import { categoryFactory } from '~/test/factories/category'
import type { CategoryFilter } from '~/utils'

const getCategorySuggestionComponent = (
  category: Category,
  filters: CategoryFilter[] = [],
) => {
  return renderSuspended(SFCategorySuggestion, {
    props: {
      categorySuggestion: {
        type: 'category',
        categorySuggestion: {
          category: category,
          filters,
        },
      },
    },
  })
}
it('should render only category name"', async () => {
  const category = categoryFactory.build({ name: 'Category', id: 1 })
  const { getByRole } = await getCategorySuggestionComponent(category)

  expect(getByRole('link', { name: category.name })).toHaveAttribute(
    'href',
    '/de/c/women-1',
  )
})

it('should render with filters', async () => {
  const category = categoryFactory.build({ name: 'Category', id: 1 })
  const { getByRole } = await getCategorySuggestionComponent(category, [
    {
      type: 'attribute',
      attributeFilter: {
        group: {
          id: 1000,
          key: 'color',
          label: 'Farbe',
          type: '',
          multiSelect: true,
        },
        values: [{ id: 32, value: 'schwarz', label: 'Schwarz' }],
      },
    },
  ])

  const link = getByRole('link', { name: `${category.name} Schwarz` })
  expect(link).toHaveAttribute('href', '/de/c/women-1?filters[color]=32')
})

it("should emit 'click:result' event", async () => {
  const category = categoryFactory.build({ name: 'Category' })
  const { emitted, getByText } = await getCategorySuggestionComponent(category)

  await fireEvent.click(getByText(category.name))
  expect(emitted()['click:result']).toHaveLength(1)
  expect(emitted()['click:result'][0]).toStrictEqual([
    {
      type: 'category',
      categorySuggestion: {
        category,
        filters: [],
      },
    },
  ])
})
