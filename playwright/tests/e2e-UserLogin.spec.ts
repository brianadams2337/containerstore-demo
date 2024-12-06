import { expect, test } from '../fixtures/fixtures'
import {
  HOMEPAGE_PATH_DE,
  LOGGED_IN_USER_DATA,
  LOGIN_WRONG_CREDENTIALS,
} from '../support/constants'

test.beforeEach(async ({ homePage, page, countryDetector }) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()
})

test('C2130648: Verify User login and log out', async ({
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

test('C2130649: Verify User login with wrong credentials', async ({
  signinPage,
  header,
  toastMessage,
}) => {
  await expect(async () => {
    await header.headerLoginButton.click()
    await signinPage.fillLoginData(
      LOGIN_WRONG_CREDENTIALS.email,
      LOGIN_WRONG_CREDENTIALS.password,
    )

    await signinPage.clickLoginButton()
    await toastMessage.assertToastInfoIsVisible()
    await toastMessage.clickToastMessageButton()
    await toastMessage.assertToastInfoNotVisible()
    await signinPage.assertLoginButtonIsVisible()
  }).toPass()
})
