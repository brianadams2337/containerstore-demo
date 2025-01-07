import { expect, test } from '../fixtures/fixtures'
import { getUserForBrowser } from '../support/utils'
import {
  HOMEPAGE_PATH_DE,
  SIGNIN_URL,
  USER_ACCOUNT,
  TEST_USERS,
} from '../support/constants'

test.beforeEach(
  async ({ signinPage, page, baseURL, countryDetector, header }, testInfo) => {
    await expect(async () => {
      const url = baseURL + SIGNIN_URL
      const projectName = testInfo.project.name
      const { email, password } = getUserForBrowser(projectName)

      await page.goto(url, { waitUntil: 'load' })
      await countryDetector.closeModal()
      await signinPage.fillLoginData(email, password)
      await signinPage.clickLoginButton()
      await page.waitForURL(HOMEPAGE_PATH_DE)
      await header.mainHeader.waitFor()
      await page.goto(baseURL + USER_ACCOUNT.accountUserPath, {
        waitUntil: 'load',
      })
      await page.waitForTimeout(1500)
      await page.waitForURL(baseURL + USER_ACCOUNT.accountUserPath)
      await header.mainHeader.waitFor()
    }).toPass()
  },
)
test.setTimeout(60000)
test.describe.configure({ mode: 'serial' })

test('C2141211: Verify Account form elements', async ({ accountPage }) => {
  await expect(async () => {
    await expect(accountPage.genderButtonGroup).toBeVisible()
    await Promise.all([
      expect(accountPage.genderRadioButton('m')).toBeVisible(),
      expect(accountPage.genderRadioButton('f')).toBeVisible(),
      expect(accountPage.genderRadioButton('d')).toBeVisible(),
    ])
    await expect(accountPage.userFirstName).toBeVisible()
    await expect(accountPage.userLastName).toBeVisible()
    await expect(accountPage.userBirthDate).toBeVisible()
    await expect(accountPage.userEmailAddress).toBeVisible()
  }).toPass()
})

test('C2132122: Verify user data update', async ({
  accountPage,
  toastMessage,
}) => {
  await test.step('Update user data - correct format', async () => {
    await expect(async () => {
      await accountPage.updateUserData(
        USER_ACCOUNT.userFirstName,
        USER_ACCOUNT.userLastName,
        USER_ACCOUNT.userBirthDateCorrect,
        true,
      )
      await toastMessage.assertToastInfoIsVisible()
    }).toPass()
  })
  await test.step('Update user data - incorrect birth date', async () => {
    await expect(async () => {
      await accountPage.updateUserData(
        USER_ACCOUNT.userFirstName,
        USER_ACCOUNT.userLastName,
        USER_ACCOUNT.userBirthDateIncorrect,
        false,
      )
      await expect(accountPage.birthdateValidationLabel).toBeVisible()
    }).toPass()
  })
})

test('C2141212: Verify password change', async ({
  accountPage,
  toastMessage,
  page,
}) => {
  await test.step('Change password - correct format', async () => {
    await expect(async () => {
      await accountPage.updatePassword(
        TEST_USERS.testUserPassword,
        TEST_USERS.testUserPassword,
        TEST_USERS.testUserPassword,
        true,
      )
      await toastMessage.assertToastInfoIsVisible()
    }).toPass()
  })
  await test.step('Change password - non-matching passwords', async () => {
    await expect(async () => {
      await accountPage.updatePassword(
        TEST_USERS.testUserPassword,
        TEST_USERS.testUserPassword,
        USER_ACCOUNT.nonMatchingPassword,
        false,
      )
      await page.waitForTimeout(1000)
      await expect(accountPage.passwordMismatchLabel).toBeVisible()
      await expect(accountPage.passwordUpdateButton).not.toBeEnabled()
    }).toPass()
  })
})
