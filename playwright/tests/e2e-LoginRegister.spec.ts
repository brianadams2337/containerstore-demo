import { expect, test } from '../fixtures/fixtures'
import {
  HOMEPAGE_PATH_DE,
  LOGGED_IN_USER_DATA,
  LOGIN_WRONG_CREDENTIALS,
  REGISTERED_TEST_USER,
} from '../support/constants'

test.beforeEach(async ({ homePage, page, countryDetector }) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()
})

test('C2130648 Verify User login and log out', async ({
  signinPage,
  header,
  accountPage,
  toastMessage,
  page,
}) => {
  await expect(async () => {
    await header.headerLoginButton.click()
    await signinPage.fillLoginData(
      LOGGED_IN_USER_DATA.email,
      LOGGED_IN_USER_DATA.password,
    )
    await signinPage.clickLoginButton()
    await page.waitForURL(HOMEPAGE_PATH_DE)

    await toastMessage.assertToastInfoIsVisible()
    await toastMessage.clickToastMessageButton()
    await header.headerLoginButton.click()
    await toastMessage.assertToastInfoNotVisible()
    await accountPage.assertLogoutButtonIsVisible()
    await accountPage.clickLogoutButton()

    await header.headerLoginButton.click()
    await signinPage.assertLoginButtonIsVisible()
  }).toPass()
})

test('C2130649 Verify User login with wrong credentials', async ({
  signinPage,
  header,
}) => {
  await expect(async () => {
    await header.headerLoginButton.click()
    await signinPage.fillLoginData(
      LOGIN_WRONG_CREDENTIALS.email,
      LOGIN_WRONG_CREDENTIALS.password,
    )

    await signinPage.clickLoginButton()
    await signinPage.loginErrorMessageContainer.waitFor()
    await expect(signinPage.loginErrorMessageContainer).toBeVisible()
  }).toPass()
})

test('C2171373 Verify User registration with already registered user account', async ({
  signinPage,
  header,
}) => {
  await test.step('Open Signin page and switch to Register tab', async () => {
    await header.headerLoginButton.waitFor()
    await header.headerLoginButton.click()
    await signinPage.registerTab.waitFor()
    await signinPage.registerTab.click()
    await signinPage.registerForm.waitFor()
  })
  await test.step('Fill and sumbit register form', async () => {
    await signinPage.selectGender('f')
    await signinPage.fillRegistrationData(
      REGISTERED_TEST_USER.firstName,
      REGISTERED_TEST_USER.lastName,
      REGISTERED_TEST_USER.emailAddress,
      REGISTERED_TEST_USER.password,
    )
    await signinPage.registerButton.click()
  })
  await test.step('Assert error banner is visible and user is not logged in', async () => {
    await signinPage.registerErrorMessageContainer.waitFor()
    await expect(signinPage.registerErrorMessageContainer).toBeVisible()
    await header.headerLoginButton.click()
    await signinPage.assertLoginButtonIsVisible()
  })
})

test('C2171375 Verify User registration password toggle button', async ({
  signinPage,
  header,
}) => {
  await header.headerLoginButton.waitFor()
  await header.headerLoginButton.click()
  await signinPage.registerTab.waitFor()
  await signinPage.registerTab.click()
  await signinPage.registerForm.waitFor()

  await signinPage.passwordInput.focus()
  await signinPage.passwordInput.fill(REGISTERED_TEST_USER.password)
  await expect(signinPage.passwordToggleShow).toBeVisible()
  await expect(signinPage.passwordToggleHide).not.toBeVisible()
  await expect(signinPage.passwordInput).toHaveAttribute('type', 'password')

  await signinPage.passwordToggleShow.click()
  await expect(signinPage.passwordToggleShow).not.toBeVisible()
  await expect(signinPage.passwordToggleHide).toBeVisible()
  await expect(signinPage.passwordInput).toHaveValue(
    REGISTERED_TEST_USER.password,
  )
  await expect(signinPage.passwordInput).toHaveAttribute('type', 'text')
})
