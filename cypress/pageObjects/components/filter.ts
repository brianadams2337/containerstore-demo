import { getLocaleFile } from '../../test-helpers'

class Filter {
  private pageElements = {
    filterButton: '[data-test-id="filter-toggle-button"]',
    colorFilterButtons: '[data-test-id="filter-color-circle"]',
    applyFilterButton: '[data-test-id="apply-filter-button"]',
    color: (ID: number) => {
      return `[aria-label*="select color"] [data-color-id="${ID}"]`
    },
    filterHeading: '[data-test-id="headline"]',
  }

  waitForFilterDisplayed(): void {
    cy.get(this.pageElements.filterHeading)
      .contains(getLocaleFile().filter.title)
      .should('be.visible')
    cy.get(this.pageElements.colorFilterButtons).should('exist')
  }

  clickOnFilterButton(): void {
    cy.get(this.pageElements.filterButton).click({ force: true })
    this.waitForFilterDisplayed()
  }

  selectColorByID(id: number): void {
    cy.get(this.pageElements.color(id)).click()
  }

  pressApplyFilterButton(): void {
    cy.get(this.pageElements.applyFilterButton).click()
  }
}

export default new Filter()
