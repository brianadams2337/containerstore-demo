import Header from '../../pageObjects/components/header'

class Search {
  private pageElements = {
    mobileSearchInput: '[data-test-id="search-input"]',
    desktopSearchButton: '[class*="relative z-30"]',
    desktopSearchInput: '#search',
    crossButton: 'svg[class*="text-white"]',
    searchIcon: '[class*="border-gray-400"] svg[class*="w-6 h-6"]',
  }

  openSearch(): void {
    Header.assertHeaderIsDisplayed()
    if (Cypress.env().mobile === true) {
      Header.clickOnSideNavButton()
      cy.get(this.pageElements.mobileSearchInput).should('be.visible')
    } else {
      cy.get(this.pageElements.desktopSearchButton).click()
      cy.get(this.pageElements.desktopSearchInput).should('be.visible')
    }
  }

  typeSearchQuery(query: string): void {
    if (Cypress.env().mobile === true) {
      cy.get(this.pageElements.mobileSearchInput).type(query)
    } else {
      cy.get(this.pageElements.desktopSearchInput).type(query)
    }
  }

  checkSearchEventIsTriggered(): void {
    cy.window().then(({ dataLayer }) => {
      const latestSearchEvent =
        dataLayer.filter((v) => v.event === 'search').pop() || null
      expect(Boolean(latestSearchEvent))
    })
  }

  clickCrossButton(): void {
    cy.get(this.pageElements.crossButton).click()
  }

  checkSearchIconDisplayed(): void {
    cy.get(this.pageElements.searchIcon).should('be.visible')
  }

  checkSearchIconNotDisplayed(): void {
    cy.get(this.pageElements.searchIcon).should('not.exist')
  }
}

export default new Search()
