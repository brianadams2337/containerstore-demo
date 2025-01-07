import { renderSuspended } from '@nuxt/test-utils/runtime'
import { expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import SFNavigationItemSuggestionList from './SFNavigationItemSuggestionList.vue'
import { navigationItemExternalFactory } from '~/test/factories/navigationTreeItem'

const getNavigationItemSuggestionsComponent = (searchTerm: string = '') => {
  return renderSuspended(SFNavigationItemSuggestionList, {
    props: {
      navigationItemSuggestions: [
        {
          type: 'navigationItem',
          navigationItemSuggestion: {
            navigationItem: navigationItemExternalFactory.build({
              name: 'Home',
            }),
          },
        },
      ],
      searchTerm,
    },
  })
}

it('should render suggestions and suggestion count', async () => {
  const { getByText, getByRole } = await getNavigationItemSuggestionsComponent()
  expect(getByText('Seiten')).toBeInTheDocument()
  expect(getByText('1')).toBeInTheDocument()
  expect(getByRole('option', { name: 'Home' })).toBeInTheDocument()
})

it("should emit 'click:result' event", async () => {
  const { emitted, getByText } = await getNavigationItemSuggestionsComponent()
  await fireEvent.click(getByText('Home'))
  expect(emitted()['click:result']).toHaveLength(1)
  expect(emitted()['click:result'][0]).toStrictEqual([
    {
      type: 'navigationItem',
      navigationItemSuggestion: {
        navigationItem: navigationItemExternalFactory.build({ name: 'Home' }),
      },
    },
  ])
})
