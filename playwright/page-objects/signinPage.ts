import { type Locator, type Page } from '@playwright/test'

export class SignInPage {
  readonly page: Page
  emailInput: Locator
  passwordInput: Locator
  loginButton: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByPlaceholder('E-Mail-Adresse')
    this.passwordInput = page.getByPlaceholder('Passwort')
    this.loginButton = page.locator('[data-test-id="login-submit"]')
  }

  async fillLoginData(email: string, password: string) {
    await this.emailInput.click()
    await this.emailInput.fill(email)
    await this.passwordInput.click()
    await this.passwordInput.fill(password)
  }

  async clickLoginButton() {
    await this.loginButton.click()
  }

  async assertLoginButtonIsVisible() {
    await this.loginButton.isVisible()
  }
}
