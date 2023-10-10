import { LOGGED_IN_USER_DATA } from '../support/constants'
import { BasePage } from './basePage'
import Header from './components/header'

class AccountSettingsPage extends BasePage {
  private pageElements = {
    firstName: 'input[id="First name"]',
    lastName: 'input[id="Last name"]',
    loginSubmitButton: 'input[id="Your date of birth"]',
    submitButton: 'button[class*="items-center"]',
    newPassword: '[id="New Password"]',
    repeatNewPassword: '[id="Confirm password"]',
    validationErrorText: '[data-test-id="validation-error-text"]',
    buttons: 'form button',
    notificationPopup: '[data-test-id="toast-info"]',
  }

  assertAccountSettingPageIsDisplayed(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.firstName)
  }

  setFirstName(expectedName: string): void {
    cy.get(this.pageElements.firstName).clear().type(expectedName)
  }

  setLastName(expectedName: string): void {
    cy.get(this.pageElements.lastName).clear().type(expectedName)
  }

  clickSaveButton(): void {
    cy.get(this.pageElements.buttons).contains('Save').click()
    cy.get(this.pageElements.notificationPopup)
  }

  setNewPassword(password: string): void {
    cy.get(this.pageElements.newPassword).scrollIntoView()
    cy.get(this.pageElements.newPassword).type(password, {
      force: Cypress.env().mobile === true,
    })
  }

  setRepeatNewPassword(password: string): void {
    cy.get(this.pageElements.repeatNewPassword).type(password, {
      force: Cypress.env().mobile === true,
    })
  }

  assertNewPasswordValidationError(text: string): void {
    cy.get(this.pageElements.validationErrorText).contains(text)
  }

  checkUserData(): void {
    cy.get(this.pageElements.firstName).should(
      'have.value',
      LOGGED_IN_USER_DATA.firstName,
    )
    cy.get(this.pageElements.lastName).should(
      'have.value',
      LOGGED_IN_USER_DATA.lastName,
    )
  }
}
export default new AccountSettingsPage()
