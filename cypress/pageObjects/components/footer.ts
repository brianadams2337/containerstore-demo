import { getLocaleFile } from '../../test-helpers'
import header from './header'
class Footer {
  private pageElements = {
    mainFooter: '#footer > .justify-between',
    shoppingPromises: '[id="shopping-promises"]',
    blackBlock: 'footer [class="bg-black"]',
    grayBlock: 'footer [class="bg-gray-400 py-2"]',
    faqButton: 'a[href="/s/faq"]',
    imprintButton: 'a[href="/s/imprint"]',
    storyblok: '[id="footer"] [class*="storyblok"]',
  }

  textStrings = {
    imprint: 'Impressum',
    storyblok: {
      companyName: 'About You SE & Co. KG',
      address: 'Domstraße 10',
      city: '20095 Hamburg',
      country: 'Germany',
    },
  }

  openFaq() {
    cy.get(this.pageElements.faqButton).click()
    cy.get(header.pageElements.pageHeadline).contains('FAQ')
  }

  openImprint() {
    cy.get(this.pageElements.imprintButton).first().click()
    cy.contains(this.textStrings.imprint)
  }

  assertStoryblokContent(): void {
    Object.entries(this.textStrings.storyblok).forEach(([key, textValue]) => {
      cy.log(`assert that ${key} is present`)
      cy.get(this.pageElements.storyblok).contains(textValue)
    })
  }

  assertFooterIsDisplayed(): void {
    cy.scrollTo('bottom')
    cy.get(this.pageElements.mainFooter).should('be.visible')
    cy.get(this.pageElements.shoppingPromises)
  }

  assertFooterText(): void {
    this.assertFooterIsDisplayed()
    const localeStrings = getLocaleFile()
    cy.log(
      `check that promises block contain ${localeStrings.promises.free_return_and_shipping}`,
    )
    cy.get(this.pageElements.shoppingPromises).contains(
      localeStrings.promises.free_return_and_shipping,
    )

    cy.log(
      `check that promises block contain ${localeStrings.promises.pay_with_invoice}`,
    )
    cy.get(this.pageElements.shoppingPromises).contains(
      localeStrings.promises.pay_with_invoice,
    )
    cy.log(
      `check that promises block contain ${localeStrings.promises.return_policy}`,
    )
    cy.get(this.pageElements.shoppingPromises).contains(
      localeStrings.promises.return_policy,
    )
  }
}

export default new Footer()
