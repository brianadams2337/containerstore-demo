import { expect, test } from '../fixtures/fixtures'

import {
  HOMEPAGE_PATH_DE,
  LOGGED_IN_USER_DATA,
  LOGIN_WRONG_CREDENTIALS,
} from '../support/constants'

test('C2130648: Verify User login and log out', async ({
  homePage,
  signinPage,
  header,
  accountPage,
  toastMessage,
  page,
}) => {
  await homePage.visitPage()
  await expect(async () => {
    await header.clickLoginHeaderButton()
    await signinPage.fillLoginData(
      LOGGED_IN_USER_DATA.email,
      LOGGED_IN_USER_DATA.password,
    )
    await signinPage.clickLoginButton()
    await page.waitForURL(HOMEPAGE_PATH_DE)

    await header.clickLoginHeaderButton()
    await toastMessage.assertToastInfoIsVisible()
    await toastMessage.clickToastMessageButton()
    await toastMessage.assertToastInfoNotVisible()
    await accountPage.assertLogoutButtonIsVisible()
    await accountPage.clickLogoutButton()

    await header.clickLoginHeaderButton()
    await signinPage.assertLoginButtonIsVisible()
  }).toPass()
})

test('C2130649: Verify User login with wrong credentials', async ({
  homePage,
  signinPage,
  header,
  toastMessage,
}) => {
  await homePage.visitPage()
  await expect(async () => {
    await header.clickLoginHeaderButton()
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
