import { expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

export class CountryDetector {
  readonly page: Page
  readonly closeButton: Locator
  readonly switchShopButton: Locator
  readonly stayInShopButton: Locator

  constructor(page: Page) {
    this.page = page
    this.closeButton = page.getByTestId('close-button')
    this.switchShopButton = page.getByTestId('button-switch-shop')
    this.stayInShopButton = page.getByTestId('button-stay-in-shop')
  }

  async closeModal() {
    try {
      await this.page.waitForLoadState('networkidle')
      if (await this.closeButton.first().isVisible()) {
        await this.closeButton.first().click()
        await expect(this.closeButton.first()).not.toBeVisible()
        await this.page.waitForLoadState('networkidle')
      }
    } catch (error) {
      console.error('Error closing modal:', error)
    }
  }
}
