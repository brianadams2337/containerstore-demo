import type { Locator, Page } from '@playwright/test'
import type { RPC } from './components/rpc'

export class AccountPage {
  readonly page: Page
  readonly rpc: RPC
  readonly logoutButton: Locator
  readonly userFirstName: Locator
  readonly userLastName: Locator
  readonly userBirthDate: Locator
  readonly userEmailAddress: Locator
  readonly formSaveButton: Locator
  readonly passwordCurrent: Locator
  readonly passwordNew: Locator
  readonly passwordNewRepeat: Locator
  readonly passwordUpdateButton: Locator
  readonly formPasswordUpdate: Locator
  readonly formValidationErrorLabel: Locator
  readonly passwordMismatchLabel: Locator
  readonly formUserData: Locator
  readonly sectionBirthdate: Locator
  readonly sectionPasswordRepeat: Locator
  readonly birthdateValidationLabel: Locator
  readonly accountTabOrders: Locator
  readonly accountTabSubscriptions: Locator
  readonly accountTabProfile: Locator
  readonly passwordErrorMessage: Locator
  readonly userProfileHeadline: Locator
  readonly accountInfoHeadline: Locator
  readonly personalInfoHeadline: Locator
  readonly passwordHeadline: Locator
  readonly genderSelection: Locator

  constructor(page: Page, rpc: RPC) {
    this.page = page
    this.rpc = rpc
    this.logoutButton = page.getByTestId('logout-button')
    this.userFirstName = page.getByTestId('user-first-name')
    this.userLastName = page.getByTestId('user-last-name')
    this.userBirthDate = page.getByTestId('user-birthdate')
    this.userEmailAddress = page.getByTestId('user-email-address')
    this.formSaveButton = page.getByTestId('personal-info-submit')
    this.passwordCurrent = page.locator(
      '[data-testid="current-password"][type="password"]',
    )
    this.passwordNew = page.locator(
      '[data-testid="new-password"][type="password"]',
    )
    this.passwordNewRepeat = page.locator(
      '[data-testid="new-password-repeat"][type="password"]',
    )
    this.passwordUpdateButton = page.getByTestId('update-password-submit')
    this.formPasswordUpdate = page.getByTestId('form-password-update')
    this.formValidationErrorLabel = page.getByTestId('validation-error-text')
    this.sectionPasswordRepeat = page.getByTestId('section-password-repeat')
    this.passwordMismatchLabel = this.sectionPasswordRepeat.getByTestId(
      'validation-error-text',
    )
    this.formUserData = page.getByTestId('form-user-data')
    this.sectionBirthdate = page.getByTestId('section-birthdate')
    this.birthdateValidationLabel = this.sectionBirthdate.getByTestId(
      'validation-error-text',
    )
    this.accountTabOrders = page.getByTestId('account-area-tab-0')
    this.accountTabSubscriptions = page.getByTestId('account-area-tab-1')
    this.accountTabProfile = page.getByTestId('account-area-tab-2')
    this.passwordErrorMessage = page.getByTestId(
      'password-error-message-container',
    )
    this.userProfileHeadline = page.getByTestId('user-profile-headline')
    this.accountInfoHeadline = page.getByTestId(
      'profile-account-information-headline',
    )
    this.personalInfoHeadline = page.getByTestId(
      'profile-personal-information-headline',
    )
    this.passwordHeadline = page.getByTestId('profile-password-headline')
    this.genderSelection = page.getByTestId('gender-selection')
  }

  async clickLogoutButton() {
    await this.logoutButton.click()
  }
  async assertLogoutButtonIsVisible() {
    await this.logoutButton.isVisible()
  }

  async updateUserData(
    firstName: string,
    lastName: string,
    birthDate: string,
    clickSaveButton: boolean,
  ) {
    const userFields = [
      { field: this.userFirstName, value: firstName },
      { field: this.userLastName, value: lastName },
      { field: this.userBirthDate, value: birthDate },
    ]

    for (const { field, value } of userFields) {
      await field.waitFor()
      await field.clear()
      await field.fill(value)
    }
    await this.page.waitForLoadState('domcontentloaded')

    if (clickSaveButton === true) {
      await this.formSaveButton.click()
    }
  }

  async updatePassword(
    currentPassword: string,
    newPassword: string,
    clickUpdateButton: boolean,
  ) {
    const passwordFields = [
      { field: this.passwordCurrent, value: currentPassword },
      { field: this.passwordNew, value: newPassword },
    ]

    for (const { field, value } of passwordFields) {
      await field.waitFor()
      await field.fill(value)
    }
    await this.page.waitForLoadState('domcontentloaded')

    if (clickUpdateButton === true) {
      await this.passwordUpdateButton.click()
    }
  }

  async userAuthentication(email: string, password: string) {
    try {
      await this.rpc.call('oauthLogin', {
        email,
        password,
      })
    } catch (error) {
      console.error('Error authenticating user:', error)
      throw error
    }
  }

  genderOption(gender: string): Locator {
    return this.page.getByTestId(`gender-option-${gender}`)
  }

  async selectGender(gender: string) {
    await this.genderSelection.waitFor()
    await this.genderSelection.click()
    await this.genderOption(gender).waitFor()
    await this.genderOption(gender).click()
  }
}
