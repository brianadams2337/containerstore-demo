import { HEADER_TEST_CATEGORY_WOMEN } from '../support/constants'
import { BasePage } from './basePage'
import Header from './components/header'
import Chainable = Cypress.Chainable

class ProductListingPage extends BasePage {
  pageElements = {
    productItem: '[data-test-id="product-item"]',
    productImage: '[data-test-id="product-item"] picture[class*="opacity-0"]',
    wishListIcon: '[data-test-id="product-item"] svg',
    price: '[data-test-id="price"]',
    productName: '[data-test-id="product-card-product-name"]',
    productPageHeading: '[data-test-id="headline"]',
    paginationButtons: '[data-test-id="paginationButton"]',
    productCountButton: '[data-test-id="totalCount"] span',
    productColor: (ID: number) => {
      return `[data-color-id="${ID}"]`
    },
    uniqueProductLinks: '[data-product-card-id]',
    articleId: (ID: number) => {
      return `article[id="product-${ID}"] `
    },
    filters: {
      filterButton: '[data-test-id="filter-toggle-button"]',
      applyFilterButton: '[data-test-id="apply-filter-button"]',
      resetFilterButton: '[data-test-id="reset-filter-button"]',
      filterColorsCircle: '[data-test-id="filter-color-circle"]',
      testColor: '[data-color-id="594"]',
      closeCross: '[data-test-id="closeCross"]',
    },
    sorting: {
      sortingButton: '[data-test-id="sorting-button"]',
      sortingOptionContainer: '[data-test-id="sorting-options-container"]',
      sortingOption: '[data-test-id="sorting-option"]',
    },
    siblingColors: {
      siblingColorsSelector: '[data-test-id="siblingColorsSelector"]',
    },
    canonicalTag: '[data-hid="canonical"]',
  }

  waitForPageToBeDisplayed(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.productItem).should('exist')
  }

  openProductByIndex(index: number): void {
    this.waitForPageToBeDisplayed()
    cy.get(this.pageElements.productItem)
      .eq(index)
      .should('exist')
      .scrollIntoView()
    cy.get(this.pageElements.productItem).eq(index).click()
  }

  checkThatProductIsVisible(index: number): void {
    cy.get(this.pageElements.productName).eq(index).should('be.visible')
  }

  openProductByClickingOnImage(index: number): void {
    this.waitForPageToBeDisplayed()
    cy.get(this.pageElements.productImage)
      .eq(index)
      .should('exist')
      .scrollIntoView()
    cy.get(this.pageElements.productImage).eq(index).click()
  }

  openProductByID(ID: number): void {
    cy.get(this.pageElements.articleId(ID)).click()
  }

  openProductBySiblingColor(articleID: number, colorID: number): void {
    cy.scrollTo('bottom', { duration: 2000 })
    cy.get(this.pageElements.siblingColors.siblingColorsSelector)
      .first()
      .should('be.visible')

    cy.get(
      this.pageElements.articleId(articleID) +
        this.pageElements.productColor(colorID),
    ).click({ force: true })
  }

  getTotalItems(): Chainable {
    return cy.get(this.pageElements.productItem)
  }

  getPaginationButtons(): Chainable {
    cy.scrollTo('bottom')
    return cy.get(this.pageElements.paginationButtons)
  }

  openFilters() {
    cy.get(this.pageElements.filters.filterButton).click({
      force: true,
    })
    cy.get(this.pageElements.filters.applyFilterButton).should('be.visible')
  }

  clickOnSorting() {
    cy.get(this.pageElements.sorting.sortingButton).click({ force: true })
  }

  clickOnProductCountButton() {
    cy.get(this.pageElements.productCountButton).click()
  }

  waitForSortingOptions() {
    cy.get(this.pageElements.sorting.sortingOptionContainer).should('exist')
    cy.get(this.pageElements.sorting.sortingOption).first().should('exist')
  }

  assertSortingButtonText(text: string) {
    cy.get(this.pageElements.sorting.sortingButton).contains(text)
  }

  setSortingOption(text: string) {
    cy.get(this.pageElements.sorting.sortingOption).first().should('exist')
    cy.get(this.pageElements.sorting.sortingOption)
      .contains(text)
      .click({ force: true })
  }

  closeFilters() {
    cy.get(this.pageElements.filters.closeCross).click()
    cy.get(this.pageElements.filters.applyFilterButton).should('not.be.visible')
  }

  selectTestColour() {
    cy.get(this.pageElements.filters.applyFilterButton).should('be.visible')
    cy.get(
      this.pageElements.filters.testColor +
        this.pageElements.filters.filterColorsCircle,
    ).click()
  }

  clickApplyFilters() {
    cy.get(this.pageElements.filters.applyFilterButton).should('be.visible')
    cy.get(this.pageElements.filters.applyFilterButton).click()

    cy.get(this.pageElements.filters.applyFilterButton).should('not.be.visible')
  }

  clickResetFilters() {
    cy.get(this.pageElements.filters.resetFilterButton).should('be.visible')
    cy.get(this.pageElements.filters.resetFilterButton).click({ force: true })
    cy.get(this.pageElements.filters.applyFilterButton).click()
    cy.get(this.pageElements.filters.applyFilterButton).should('not.be.visible')
  }

  assertThatProductColorVisibleOnProducts(id: number): void {
    cy.get(this.pageElements.productColor(id)).each(($el) => {
      $el.is(':visible')
    })
  }

  checkViewItemListTrackingEvent(
    totalRows: number,
    totalItems: number,
    itemsInRow = 4,
  ): void {
    cy.window().then(({ dataLayer }) => {
      cy.wait(2000)
      cy.findTrackingEvent('view_item_list', dataLayer).then((index) => {
        expect(index).to.be.greaterThan(-1)
        expect(dataLayer[index].ecommerce.items.length).equal(
          totalRows >= 1 ? itemsInRow : totalItems,
        )
      })
    })
  }

  openTestCategory() {
    Header.selectCategoryOnNavBar(HEADER_TEST_CATEGORY_WOMEN.toLowerCase())
    if (Cypress.env().mobile === true) {
      Header.selectCategoryOnNavBar(HEADER_TEST_CATEGORY_WOMEN.toLowerCase())
    }
  }

  assertHeaderName(expectedHeaderName: string): void {
    cy.get(this.pageElements.productPageHeading).should(
      'include.text',
      expectedHeaderName,
    )
  }
}
export default new ProductListingPage()
