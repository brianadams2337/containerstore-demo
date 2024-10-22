import type { Locator, Page } from '@playwright/test'

export class AccountPage {
  readonly page: Page
  readonly logoutButton: Locator
  readonly genderButtonGroup: Locator
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

  constructor(page: Page) {
    this.page = page
    this.logoutButton = page.getByTestId('logout-button')
    this.genderButtonGroup = page.getByTestId('radio-group-gender')
    this.userFirstName = page.getByTestId('user-first-name')
    this.userLastName = page.getByTestId('user-last-name')
    this.userBirthDate = page.getByTestId('user-birthdate')
    this.userEmailAddress = page.getByTestId('user-email-address')
    this.formSaveButton = page.getByTestId('save-button')
    this.passwordCurrent = page.locator(
      '[data-testid="current-password"][type="password"]',
    )
    this.passwordNew = page.locator(
      '[data-testid="new-password"][type="password"]',
    )
    this.passwordNewRepeat = page.locator(
      '[data-testid="new-password-repeat"][type="password"]',
    )
    this.passwordUpdateButton = page.getByTestId('update-password-button')
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
  }

  genderRadioButton(gender: string): Locator {
    return this.genderButtonGroup.getByTestId(`radio-button-${gender}`)
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
    newPasswordRepeat: string,
    clickUpdateButton: boolean,
  ) {
    const passwordFields = [
      { field: this.passwordCurrent, value: currentPassword },
      { field: this.passwordNew, value: newPassword },
      { field: this.passwordNewRepeat, value: newPasswordRepeat },
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
      await this.page.request.post('/de/api/rpc/oauthLogin', {
        data: {
          payload: { email, password },
        },
      })
    } catch (error) {
      console.error('Error authenticating user:', error)
      throw error
    }
  }
}
