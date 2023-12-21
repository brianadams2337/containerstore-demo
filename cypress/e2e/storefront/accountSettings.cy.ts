import HomePage from '../../pageObjects/homePage'
import Header from '../../pageObjects/components/header'
import Footer from '../../pageObjects/components/footer'
import AccountSettingsPage from '../../pageObjects/accountSettingsPage'
import { getLocaleFile } from '../../test-helpers'
import { LOGGED_IN_USER_DATA } from '../../support/constants'
import SignInPage from '../../pageObjects/signInPage'

describe(`Account settings:`, { testIsolation: false }, () => {
  before(() => {
    HomePage.open()
    HomePage.waitForPageToBeDisplayed()
    HomePage.closePromotionButton()
    Header.clickOnSignInButton()
    SignInPage.waitForPageToBeDisplayed()
    SignInPage.login()
    HomePage.waitForPageToBeDisplayed()
    Header.clickOnAccountSettingsButton()
    AccountSettingsPage.assertAccountSettingPageIsDisplayed()
  })

  after(() => {
    cy.clearSiteData()
  })

  it('Account Settings - check that header and footer is displayed', () => {
    Header.assertHeaderIsDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.assertFooterText()
  })

  it('Account Settings - set user data', () => {
    AccountSettingsPage.setFirstName(LOGGED_IN_USER_DATA.firstName)
    AccountSettingsPage.setLastName(LOGGED_IN_USER_DATA.lastName)
    AccountSettingsPage.clickSaveButton()
  })

  if (Cypress.env().mobile !== true) {
    it('Account Settings - check user data', () => {
      AccountSettingsPage.checkUserData()
    })
  }

  it('Account Settings - password is weak error check', () => {
    AccountSettingsPage.setNewPassword('1')
    AccountSettingsPage.assertNewPasswordValidationError(
      getLocaleFile().validation.password.replace('{field}', 'Neues Passwort'),
    )
  })

  it('Account Settings - passwords are not equal error check', () => {
    AccountSettingsPage.setNewPassword('123asdQWE!@#')
    AccountSettingsPage.setRepeatNewPassword('1')
    AccountSettingsPage.assertNewPasswordValidationError(
      getLocaleFile()
        .validation.same_as.replace('{field}', 'Bestätige das Passwort')
        .replace('{otherField}', 'Neues Passwort'),
    )
  })
})
