import { test } from '../fixtures/fixtures'

import { LOGGED_IN_USER_DATA } from '../support/constants'

test('Verify User login and log out', async ({
  homePage,
  signinPage,
  header,
  accountPage,
  page,
}) => {
  await homePage.visitPage()
  await header.clickLoginHeaderButton()
  await signinPage.fillLoginData(
    LOGGED_IN_USER_DATA.email,
    LOGGED_IN_USER_DATA.password,
  )
  await signinPage.clickLoginButton()
  await page.waitForURL('/')

  await header.clickLoginHeaderButton()
  await accountPage.assertLogoutButtonIsVisible()
  await accountPage.clickLogoutButton()

  await header.clickLoginHeaderButton()
  await signinPage.assertLoginButtonIsVisible()
})
