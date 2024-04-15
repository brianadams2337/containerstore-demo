import Header from '../../pageObjects/components/header'

class Search {
  private pageElements = {
    mobileSearchInput: 'input[data-test-id="sidebar-search-input"]',
    desktopSearchInput: 'input[data-test-id="header-search-input"]',
    desktopSearchButton: 'button[data-test-id="header-search-button"]',
    closeButton: 'button[data-test-id="close-search-button"]',
  }

  openSearch(): void {
    Header.assertHeaderIsDisplayed()
    if (Cypress.env().mobile === true) {
      Header.clickOnSideNavButton()
      cy.get(this.pageElements.mobileSearchInput).should('be.visible')
    } else {
      cy.wait(3000)
      cy.get(this.pageElements.desktopSearchButton).click({ force: true })
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

  clickCloseSearchButton(): void {
    cy.get(this.pageElements.closeButton).click()
  }

  checkSearchIconDisplayed(): void {
    cy.get(this.pageElements.desktopSearchButton).should('be.visible')
  }

  checkSearchIconNotDisplayed(): void {
    cy.get(this.pageElements.desktopSearchButton).should('not.exist')
  }
}

export default new Search()
