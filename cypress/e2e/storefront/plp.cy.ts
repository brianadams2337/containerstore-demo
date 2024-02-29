import { TEST_ITEM_REGULAR } from '../../support/constants'
import HomePage from '../../pageObjects/homePage'
import ProductListingPage from '../../pageObjects/productListingPage'
import { getLocaleFile } from '../../test-helpers'
import ProductPage from '../../pageObjects/productPage'

let expectedRowsCount: number
let expectedColumnsCount: number
const locale = getLocaleFile()

if (Cypress.env().mobile !== true) {
  expectedRowsCount = 4
  expectedColumnsCount = 6
} else {
  expectedRowsCount = 2
  expectedColumnsCount = 12
}

beforeEach(() => {
  HomePage.open()
  ProductListingPage.openTestCategory()
  ProductListingPage.waitForPageToBeDisplayed()
  cy.scrollTo('bottom', { duration: 2000 })
})

afterEach(() => {
  cy.clearSiteData()
})

const productCount = expectedRowsCount * expectedColumnsCount
describe('Product Listing Page: products visibility', () => {
  it('Click on a product image > Product details page opens', () => {
    ProductListingPage.openProductByClickingOnImage(0)
    ProductPage.waitForPageToBeDisplayed()
  })
})

describe('Product Listing Page', { testIsolation: false }, () => {
  it('check count of the Columns', () => {
    const arr: any[] = []
    cy.get(ProductListingPage.pageElements.productItem)
      .each(($element) => {
        const elementPosition = $element[0].getBoundingClientRect()
        arr.push(elementPosition.x)
      })
      .then(() => {
        const countMap = new Map()
        for (const elem of arr) {
          if (countMap.has(elem)) {
            countMap.set(elem, countMap.get(elem) + 1)
          } else {
            countMap.set(elem, 1)
          }
        }
        countMap.forEach((values) => {
          expect(values).eq(expectedColumnsCount)
        })
      })
  })

  it('check count of the Rows', () => {
    const arr: any[] = []
    cy.get(ProductListingPage.pageElements.productItem)
      .each(($element) => {
        const elementPosition = $element[0].getBoundingClientRect()
        arr.push(elementPosition.y)
      })
      .then(() => {
        const countMap = new Map()
        for (const elem of arr) {
          if (countMap.has(elem)) {
            countMap.set(elem, countMap.get(elem) + 1)
          } else {
            countMap.set(elem, 1)
          }
        }
        countMap.forEach((values) => {
          expect(values).eq(expectedRowsCount)
        })
      })
  })

  it('check count of the unique product links that are displayed on a page', () => {
    const arr: any[] = []
    cy.get(ProductListingPage.pageElements.uniqueProductLinks)
      .each(($element) => {
        arr.push($element)
      })
      .then(() => {
        expect(arr.length).eq(productCount)
      })
  })

  it('check count of add to wishlist buttons on the products (should equal product count)', () => {
    const arr: any[] = []
    cy.get(ProductListingPage.pageElements.wishListIcon)
      .each(($element) => {
        arr.push($element)
      })
      .then(() => {
        expect(arr.length).eq(productCount)
      })
  })

  it('check count of prices on the products (should equal product count)', () => {
    const arr: any[] = []
    cy.get(ProductListingPage.pageElements.price)
      .each(($element) => {
        arr.push($element)
      })
      .then(() => {
        expect(arr.length).eq(productCount)
      })
  })

  it('check count of images on the products (should >= product count)', () => {
    const arr: any[] = []
    cy.get(ProductListingPage.pageElements.price)
      .each(($element) => {
        arr.push($element)
      })
      .then(() => {
        expect(arr.length >= productCount).eq(true)
      })
  })

  it('Open product by color sibling', () => {
    ProductListingPage.openTestCategory()
    ProductListingPage.waitForPageToBeDisplayed()
    ProductListingPage.openProductBySiblingColor(
      TEST_ITEM_REGULAR.id,
      TEST_ITEM_REGULAR.colorOptionPink,
    )
    ProductPage.waitForPageToBeDisplayed()
  })
})

describe('Filters', { testIsolation: false }, () => {
  it('verify that after all filter elements are shown on a page', () => {
    ProductListingPage.openFilters()
    const strings = getLocaleFile()
    cy.contains(strings.filter.title)
    cy.contains(strings.filter.size)
    cy.contains(strings.filter.brands)
    cy.contains(strings.filter.colors)
    cy.contains(strings.filter.price)
    ProductListingPage.closeFilters()
  })

  it('Close filter with X button > Filter is closed', () => {
    ProductListingPage.openFilters()
    ProductListingPage.closeFilters()
  })

  it('Remove a filtering option clicking on breadcrumb > Product selection is updated and Product count is updated', () => {
    cy.get(ProductListingPage.pageElements.productItem).then((elm) => {
      ProductListingPage.openFilters()
      ProductListingPage.selectTestColour()
      ProductListingPage.clickApplyFilters()

      cy.log('check that filter is reset back after click on category:')
      ProductListingPage.openTestCategory()
      ProductListingPage.waitForPageToBeDisplayed()
      cy.scrollTo('bottom', { duration: 4000 })
      cy.get(ProductListingPage.pageElements.productItem).then((products) => {
        expect(elm.length).eq(products.length)
      })
    })
  })

  it('verify that after clicking on filter - button text got changed', () => {
    ProductListingPage.openFilters()
    cy.get(ProductListingPage.pageElements.filters.applyFilterButton).contains(
      getLocaleFile().filter.show_results,
    )

    ProductListingPage.selectTestColour()
    cy.get(ProductListingPage.pageElements.filters.applyFilterButton).contains(
      getLocaleFile().filter.show_results_count.replace('{count}', '1'),
    )
  })

  it('verify that after applying filter - items count reduced to count that was displayed on Filter Button', () => {
    ProductListingPage.openFilters()
    ProductListingPage.selectTestColour()
    cy.wait(1000)
    cy.get(ProductListingPage.pageElements.filters.applyFilterButton)
      .invoke('text')
      .then((text) => {
        const numberFromFilters = text.match(/\(([^)]+)\)/)![1]

        ProductListingPage.clickApplyFilters()
        ProductListingPage.waitForPageToBeDisplayed()

        cy.get(ProductListingPage.pageElements.productItem)
          .then((elm) => elm.length.toString())
          .should('eq', numberFromFilters)
      })
  })

  it('verify that after applying filter - items count not equal to the counter on a page (show all in category)', () => {
    ProductListingPage.openFilters()
    ProductListingPage.selectTestColour()
    ProductListingPage.clickApplyFilters()
    cy.scrollTo('bottom', { duration: 4000 })
    cy.get(ProductListingPage.pageElements.productItem).then((elm) => {
      cy.get(ProductListingPage.pageElements.productCountButton)
        .invoke('text')
        .should('not.eq', ` (${elm.length}) `)
    })
  })

  it('check that All counter is same after filter reset', () => {
    cy.get(ProductListingPage.pageElements.productCountButton).then((elm) => {
      const initialNumber = elm.text()

      ProductListingPage.openFilters()
      ProductListingPage.selectTestColour()
      ProductListingPage.clickApplyFilters()
      ProductListingPage.openFilters()
      ProductListingPage.clickResetFilters()

      cy.get(ProductListingPage.pageElements.productCountButton)
        .invoke('text')
        .should('eq', initialNumber)
    })
  })

  it(' Filter should be opened after clicking on "ALL" button', () => {
    cy.clearSiteData()
    HomePage.open()
    ProductListingPage.openTestCategory()
    ProductListingPage.waitForPageToBeDisplayed()
    cy.scrollTo('bottom', { duration: 4000 })
    ProductListingPage.openFilters()
    ProductListingPage.selectTestColour()
    ProductListingPage.clickApplyFilters()
    ProductListingPage.clickOnProductCountButton()
  })
})
describe('Sorting', { testIsolation: false }, () => {
  it('Click on sorting button > Sorting menu is shown', () => {
    cy.log('assert that default sorting is: Newest')
    ProductListingPage.assertSortingButtonText(
      locale.sorting_select.date_newest,
    )
    ProductListingPage.clickOnSorting()
    ProductListingPage.waitForSortingOptions()
    cy.contains(locale.sorting_select.date_newest)
    cy.contains(locale.sorting_select.price_desc)
    cy.contains(locale.sorting_select.price_asc)
    cy.contains(locale.sorting_select.reduction_desc)
    cy.contains(locale.sorting_select.reduction_asc)
  })

  it('Select a sorting option > Sorting button is updated;Product order is updated', () => {
    const products: string[] = []
    cy.get(ProductListingPage.pageElements.productItem)
      .each((elm) => {
        products.push(elm.text())
      })
      .then(() => {
        cy.log(products.toString())

        ProductListingPage.assertSortingButtonText(
          locale.sorting_select.date_newest,
        )
        ProductListingPage.clickOnSorting()
        ProductListingPage.waitForSortingOptions()
        ProductListingPage.setSortingOption(locale.sorting_select.price_asc)

        const sortedProducts: string[] = []

        cy.get(ProductListingPage.pageElements.productItem)
          .each((elm) => {
            sortedProducts.push(elm.text())
          })
          .then(() => {
            expect(JSON.stringify(products)).not.eq(
              JSON.stringify(sortedProducts),
            )
          })

        ProductListingPage.assertSortingButtonText(
          locale.sorting_select.price_asc,
        )
      })
  })
})

if (Cypress.env().mobile !== true) {
  describe('Scroll', () => {
    it('Check scroll position when going back from PDP to PLP', () => {
      const productIndex = 12
      cy.scrollTo('bottom', { duration: 2000 })
      ProductListingPage.checkThatProductIsVisible(productIndex)

      ProductListingPage.openProductByIndex(productIndex)
      ProductPage.waitForPageToBeDisplayed()
      ProductPage.clickBackButton()
      ProductListingPage.waitForPageToBeDisplayed()
      ProductListingPage.checkThatProductIsVisible(productIndex)
    })
  })
}

describe('canonical URl check', () => {
  it('Check canonical tag to lead to PLP', () => {
    const credentials = Cypress.config('baseUrl')!.split('@')[0] + '@'
    cy.get(ProductListingPage.pageElements.canonicalTag)
      .invoke('attr', 'href')
      .then((href) => {
        const newUrl = href!.replace('https://', credentials)
        cy.visit(newUrl)
        ProductListingPage.waitForPageToBeDisplayed()
      })
  })
})
