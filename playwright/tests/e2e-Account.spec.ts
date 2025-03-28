import { expect, test } from '../fixtures/fixtures'
import { getUserForBrowser } from '../support/utils'
import {
  HOMEPAGE_PATH_DE,
  SIGNIN_URL,
  USER_ACCOUNT,
  TEST_USERS,
} from '../support/constants'

test.beforeEach(
  async (
    { signinPage, page, baseURL, countryDetector, header, toastMessage },
    testInfo,
  ) => {
    const url = `${baseURL + SIGNIN_URL}?redirectUrl=${HOMEPAGE_PATH_DE}`
    const projectName = testInfo.project.name
    const { email, password } = getUserForBrowser(projectName)

    await page.goto(url, { waitUntil: 'load' })
    await countryDetector.closeModal()
    await signinPage.fillLoginData(email, password)
    await signinPage.clickLoginButton()
    await toastMessage.toastInfo.waitFor()
    await toastMessage.clickToastMessageButton()
    await page.waitForURL(HOMEPAGE_PATH_DE)
    await header.mainHeader.waitFor()
    await header.headerLoginButton.click()
    await page.waitForLoadState('domcontentloaded')
  },
)

test('C2188614 C2188628 Verify Account area landing page', async ({
  accountPage,
  page,
}) => {
  await test.step('Verify Orders tab is loaded by default', async () => {
    await accountPage.accountTabOrders.waitFor()
    await expect(accountPage.accountTabOrders).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(page.url()).toContain(USER_ACCOUNT.routeOrders)
  })
  await test.step('Verify Subscription page is loaded', async () => {
    await accountPage.accountTabSubscriptions.click()
    await page.waitForLoadState('domcontentloaded')
    await expect(accountPage.accountTabSubscriptions).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(page.url()).toContain(USER_ACCOUNT.routeSubscriptions)
  })
  await test.step('Verify Profile page is loaded', async () => {
    await accountPage.accountTabProfile.click()
    await page.waitForLoadState('domcontentloaded')
    await expect(accountPage.accountTabProfile).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(page.url()).toContain(USER_ACCOUNT.routeProfile)
    await expect(accountPage.userProfileHeadline).toBeVisible()
    await expect(accountPage.accountInfoHeadline).toBeVisible()
    await expect(accountPage.personalInfoHeadline).toBeVisible()
    await expect(accountPage.passwordHeadline).toBeVisible()
  })
})

test('C2190952 Verify Account user data update', async ({
  accountPage,
  toastMessage,
  page,
}) => {
  await test.step('Update user data - correct input format', async () => {
    await accountPage.accountTabProfile.click()
    await page.waitForLoadState('domcontentloaded')
    await accountPage.selectGender('f')
    await accountPage.updateUserData(
      USER_ACCOUNT.userFirstName,
      USER_ACCOUNT.userLastName,
      USER_ACCOUNT.userBirthDateCorrect,
      true,
    )
    await toastMessage.assertToastInfoIsVisible()
  })
  await test.step('Update user data - incorrect birth date input format', async () => {
    await accountPage.updateUserData(
      USER_ACCOUNT.userFirstName,
      USER_ACCOUNT.userLastName,
      USER_ACCOUNT.userBirthDateIncorrect,
      false,
    )
    await expect(accountPage.birthdateValidationLabel).toBeVisible()
    await expect(accountPage.formSaveButton).not.toBeEnabled()
  })
})

test('C2188629 Verify Account password update', async ({
  accountPage,
  toastMessage,
  page,
}) => {
  await test.step('Update password - correct format and matching passwords', async () => {
    await accountPage.accountTabProfile.click()
    await page.waitForLoadState('domcontentloaded')
    await accountPage.updatePassword(
      TEST_USERS.testUserPassword,
      TEST_USERS.testUserPassword,
      true,
    )
    await toastMessage.assertToastInfoIsVisible()
    await toastMessage.clickToastMessageButton()
  })
  await test.step('Update password - incorrect current password', async () => {
    await accountPage.updatePassword(
      USER_ACCOUNT.nonMatchingPassword,
      TEST_USERS.testUserPassword,
      true,
    )
    await accountPage.passwordErrorMessage.waitFor()
    await expect(accountPage.passwordErrorMessage).toBeVisible()
  })
})
