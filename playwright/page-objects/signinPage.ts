import type { Locator, Page } from '@playwright/test'

export class SignInPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly loginErrorMessageContainer: Locator
  readonly regGenderSelector: Locator
  readonly regInputFirstName: Locator
  readonly regInputLastName: Locator
  readonly regInputEmailAddress: Locator
  readonly regInputPassword: Locator
  readonly registerButton: Locator
  readonly loginTab: Locator
  readonly registerTab: Locator
  readonly registerForm: Locator
  readonly registerErrorMessageContainer: Locator
  readonly passwordToggleShow: Locator
  readonly passwordToggleHide: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByPlaceholder('E-Mail-Adresse')
    this.passwordInput = page.getByPlaceholder('Passwort')
    this.loginButton = page.getByTestId('login-submit')
    this.loginErrorMessageContainer = page.getByTestId(
      'login-error-message-container',
    )
    this.regGenderSelector = page.getByTestId('gender-selection')
    this.regInputFirstName = page.getByTestId('reg-input-first-name')
    this.regInputLastName = page.getByTestId('reg-input-last-name')
    this.regInputEmailAddress = page.getByTestId('reg-input-email-address')
    this.regInputPassword = page.getByTestId('reg-input-password')
    this.registerButton = page.getByTestId('register-submit')
    this.loginTab = page.getByTestId('login-form-tab-0')
    this.registerTab = page.getByTestId('login-form-tab-1')
    this.registerForm = page.getByTestId('register-form')
    this.registerErrorMessageContainer = page.getByTestId(
      'register-error-message-container',
    )
    this.passwordToggleShow = page.getByTestId('password-toggle-show')
    this.passwordToggleHide = page.getByTestId('password-toggle-hide')
  }

  async fillLoginData(email: string, password: string) {
    await this.emailInput.click()
    await this.emailInput.fill(email)
    await this.passwordInput.click()
    await this.passwordInput.fill(password)
  }

  async clickLoginButton() {
    await this.loginButton.click()
    await this.page.waitForTimeout(500)
    await this.page.waitForLoadState('domcontentloaded')
  }

  async assertLoginButtonIsVisible() {
    await this.loginButton.isVisible()
  }

  genderOption(gender: string): Locator {
    return this.page.getByTestId(`gender-option-${gender}`)
  }

  async selectGender(gender: string) {
    await this.regGenderSelector.waitFor()
    await this.regGenderSelector.click()
    await this.genderOption(gender).waitFor()
    await this.genderOption(gender).click()
  }

  async fillRegistrationData(
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string,
  ) {
    await this.regInputFirstName.waitFor()
    await this.regInputFirstName.focus()
    await this.regInputFirstName.fill(firstName)
    await this.regInputLastName.focus()
    await this.regInputLastName.fill(lastName)
    await this.regInputEmailAddress.focus()
    await this.regInputEmailAddress.fill(emailAddress)
    await this.regInputPassword.focus()
    await this.regInputPassword.fill(password)
  }
}
