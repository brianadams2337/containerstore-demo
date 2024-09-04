import type { Locator, Page } from '@playwright/test'
import { expect } from '../../fixtures/fixtures'

export class Footer {
  readonly page: Page
  readonly footerWrapper: Locator
  readonly shoppingPromises: Locator
  readonly shoppingPromiseInvoice: Locator
  readonly shoppingPromiseShipping: Locator
  readonly shoppingPromiseReturn: Locator
  readonly footerGroupTitle: Locator

  constructor(page: Page) {
    this.page = page
    this.footerWrapper = page.getByTestId('footer')
    this.shoppingPromises = this.footerWrapper.getByTestId('shopping-promises')
    this.shoppingPromiseInvoice = this.shoppingPromises.getByTestId(
      'shopping-promise-invoice',
    )
    this.shoppingPromiseShipping = this.shoppingPromises.getByTestId(
      'shopping-promise-shipping',
    )
    this.shoppingPromiseReturn = this.shoppingPromises.getByTestId(
      'shopping-promise-return',
    )
    this.footerGroupTitle = page.getByTestId('footer-group-title')
  }

  async verifyFooterLinks(linksGroup: { [key: string]: string }) {
    await expect(async () => {
      for (const linkKey in linksGroup) {
        const typedLinkKey = linkKey as keyof typeof linksGroup
        const linkUrl = linksGroup[typedLinkKey]

        const linkElement = await this.page.$(`a[href="${linkUrl}"]`)
        expect(linkElement).toBeTruthy()
      }
    }).toPass()
  }
}
