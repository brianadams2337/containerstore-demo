import type { Locator, Page } from '@playwright/test'
import { expect } from '../../fixtures/fixtures'

export class ToastMessage {
  readonly page: Page
  readonly toastInfo: Locator
  readonly toastInfoButton: Locator

  constructor(page: Page) {
    this.page = page
    this.toastInfo = page.getByTestId('toast-info')
    this.toastInfoButton = page.getByTestId('toast-info-button')
  }

  async assertToastInfoIsVisible() {
    await expect(this.toastInfo).toBeVisible()
  }

  async clickToastMessageButton() {
    await this.toastInfo.getByText('OK').click()
  }

  async assertToastInfoNotVisible() {
    await this.toastInfo.isHidden()
  }
}
