class Header {
  pageElements = {
    mainHeader: '[data-test-id="main-header"]',
    pageHeadline: '[data-test-id="headline"]',
    headerImage: '[class*="nuxt-link"]',
    headerSearchInput: 'input[id="search"]',
    navBarOverflow: 'nav[class*="overflow-y-auto"]',
    headerUserButton: '[data-test-id="user-popover"]',
    logInButton: 'a[href*="/signin"]',
    userAccountButton: 'a[href*="/account/user"]',
    userOrdersButton: 'a[href*="/account/order"]',
    headerWishlistLink: '[data-test-id="wishlist-link"]',
    headerBasketButton: '[data-test-id="basket-link"]',
    headerBasketCounter:
      '[data-test-id="basket-link"] span[class*="text-white"]',
    headerLoginButton: '[data-test-id="user-popover"]',
    headerNavBar: '[data-test-id="nav-categories"]',
    mobileNavigationButton: '[data-test-id="side-navigation-button"]',
  }

  assertHeaderIsDisplayed(): void {
    cy.get(this.pageElements.mainHeader).should('be.visible')
  }

  clickOnBasketButton(): void {
    cy.get(this.pageElements.headerBasketButton).click()
  }

  clickOnWishlistButton(): void {
    cy.get(this.pageElements.headerWishlistLink).click({
      force: true,
    })
  }

  clickOnSignInButton(): void {
    cy.get(this.pageElements.headerLoginButton).click({
      force: true,
    })
    cy.get(this.pageElements.logInButton).first().click({ force: true })
  }

  clickOnAccountSettingsButton(): void {
    cy.get(this.pageElements.headerLoginButton).click()
    cy.get(this.pageElements.userAccountButton)
      .should('be.visible')
      .first()
      .click({ force: true })
  }

  clickOnOrdersButton(): void {
    cy.get(this.pageElements.headerLoginButton).click()
    cy.get(this.pageElements.userOrdersButton)
      .should('be.visible')
      .first()
      .click({ force: true })
  }

  assertShoppingBagCounter(expectedNumber: number): void {
    if (expectedNumber === 0) {
      cy.get(this.pageElements.headerBasketCounter).should('not.exist')
    } else {
      cy.get(this.pageElements.headerBasketCounter).contains(
        expectedNumber.toString(),
      )
    }
  }

  selectCategoryOnNavBar(categoryName: string): void {
    if (Cypress.env().mobile !== true) {
      cy.get(this.pageElements.headerNavBar)
        .get(`a[href*='/${categoryName}']`)
        .first()
        .click()
    } else {
      this.clickOnSideNavButton()
      cy.get('nav[class*="overflow-y-auto "] a').each(($elem) => {
        if ($elem.text().toLowerCase().includes(categoryName)) {
          cy.wrap($elem).click()
        }
      })
    }
  }

  wishlistAssertProductCount(count: number): void {
    if (count === 0) {
      cy.get(this.pageElements.headerWishlistLink)
    } else {
      cy.get(this.pageElements.headerWishlistLink)
        .invoke('text')
        .should('contain', count.toString())
    }
  }

  basketAssertProductCount(count: number): void {
    cy.get(this.pageElements.headerBasketButton)
      .children('[data-badge-content]')
      .invoke('attr', 'data-badge-content')
      .should('eq', count.toString())
  }

  clickOnSideNavButton(): void {
    cy.get(this.pageElements.mobileNavigationButton)
      .should('be.visible')
      .click()
    cy.get(this.pageElements.navBarOverflow).should('be.visible')
  }
}

export default new Header()
