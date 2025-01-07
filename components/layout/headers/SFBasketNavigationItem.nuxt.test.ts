import { ref } from 'vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { expect, it, vi } from 'vitest'
import type { CentAmount } from '@scayle/storefront-core'
import { fireEvent } from '@testing-library/vue'
import SFBasketNavigationItem from './SFBasketNavigationItem.vue'
import { priceFactory } from '~/test/factories/price'
import { productFactory } from '~/test/factories/product'
import { variantFactory } from '~/test/factories/variant'

const { useBasket, useUser } = vi.hoisted(() => {
  return {
    useBasket: vi.fn(),
    useUser: vi.fn(),
  }
})

vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useBasket,
    useUser,
    useCurrentShop: () => ref({ locale: new Intl.Locale('de-DE') }),
    useFormatHelpers: () => ({
      formatCurrency: (value: number) => `${value / 100}€`,
      formatPercentage: vi
        .fn()
        .mockImplementation((value: number) => `${value * 100}%`),
    }),
  }
})

it('should render SFBasketNavigationItem with empty basket', async () => {
  useBasket.mockReturnValue({
    count: ref(0),
    status: ref('success'),
    items: ref([]),
    isEmpty: ref(true),
  })
  const { getByRole, getByText, getByTestId } = await renderSuspended(
    SFBasketNavigationItem,
  )
  await fireEvent.mouseEnter(getByTestId('popoverContainer'))

  const basketLink = getByRole('link', { name: 'Warenkorb' })
  expect(basketLink).toBeInTheDocument()
  expect(basketLink).toHaveAttribute('href', '/de/basket')
  expect(
    getByText('Sie haben keine Produkte in Ihrem Warenkorb.'),
  ).toBeInTheDocument()
})

const getBasketItems = (itemCount: number) => {
  return Array(itemCount).fill({
    key: 'key',
    customData: {},
    packageId: 1,
    price: {
      total: priceFactory.build(),
      unit: priceFactory.build(),
    },
    lowestPriorPrice: {
      relativeDifferenceToPrice: 0,
      withTax: 1000 as CentAmount,
    },
    quantity: 1,
    status: 'available',
    product: productFactory.build(),
    variant: variantFactory.build(),
    displayData: {},
  })
}

it.each([1, 2])(
  'should render basket SFBasketNavigationItem with %i basket item and logged out user',
  async (itemCount) => {
    useBasket.mockReturnValue({
      count: ref(itemCount),
      status: ref('success'),
      items: ref(getBasketItems(itemCount)),
      isEmpty: ref(false),
      then: vi.fn(),
    })
    useUser.mockReturnValue({
      isLoggedIn: ref(false),
      status: ref('success'),
    })
    const { getByRole, getAllByRole, getByTestId, queryByText } =
      await renderSuspended(SFBasketNavigationItem)
    await fireEvent.mouseEnter(getByTestId('popoverContainer'))

    const basketLink = getByRole('link', {
      name: `Warenkorb, ${itemCount} Artikel`,
    })
    expect(basketLink).toBeInTheDocument()
    expect(basketLink).toHaveAttribute('href', '/de/basket')
    expect(basketLink).toHaveTextContent(`${itemCount}`)
    expect(
      queryByText('Sie haben keine Produkte in Ihrem Warenkorb.'),
    ).not.toBeInTheDocument()
    expect(getAllByRole('article')).toHaveLength(itemCount)

    const basketButton = getByRole('link', { name: 'Warenkorb' })
    expect(basketButton).toBeInTheDocument()
    expect(basketButton).toHaveAttribute('href', '/de/basket')

    const checkoutButton = getByRole('link', { name: 'Zur Kasse' })
    expect(checkoutButton).toBeInTheDocument()
    expect(checkoutButton).toHaveAttribute('href', '/de/signin')
  },
)

it.each([1, 2])(
  'should render basket SFBasketNavigationItem with %i basket item and logged in user',
  async (itemCount) => {
    useBasket.mockReturnValue({
      count: ref(itemCount),
      status: ref('success'),
      items: ref(getBasketItems(itemCount)),
      isEmpty: ref(false),
      then: vi.fn(),
    })
    useUser.mockReturnValue({
      isLoggedIn: ref(true),
      status: ref('success'),
    })

    const { getByRole, getAllByRole, getByTestId, queryByText } =
      await renderSuspended(SFBasketNavigationItem)
    await fireEvent.mouseEnter(getByTestId('popoverContainer'))

    const basketLink = getByRole('link', {
      name: `Warenkorb, ${itemCount} Artikel`,
    })
    expect(basketLink).toBeInTheDocument()
    expect(basketLink).toHaveAttribute('href', '/de/basket')
    expect(basketLink).toHaveTextContent(`${itemCount}`)
    expect(
      queryByText('Sie haben keine Produkte in Ihrem Warenkorb.'),
    ).not.toBeInTheDocument()
    expect(getAllByRole('article')).toHaveLength(itemCount)

    const basketButton = getByRole('link', { name: 'Warenkorb' })
    expect(basketButton).toBeInTheDocument()
    expect(basketButton).toHaveAttribute('href', '/de/basket')

    const checkoutButton = getByRole('link', { name: 'Zur Kasse' })
    expect(checkoutButton).toBeInTheDocument()
    expect(checkoutButton).toHaveAttribute('href', '/de/checkout')
  },
)
