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

  console.log('Assert if the user is logged in and then perform log out')
  await header.clickLoginHeaderButton()
  await accountPage.assertLogoutButtonIsVisible()
  await accountPage.clickLogoutButton()

  console.log('Assert if the user is logged out')
  await header.clickLoginHeaderButton()
  await signinPage.assertLoginButtonIsVisible()
})
