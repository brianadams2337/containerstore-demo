import { expect, test } from '../fixtures/fixtures'
import { isMobile } from '../support/utils'
import {
  HOMEPAGE_PATH_DE,
  LOGGED_IN_USER_DATA,
  LOGIN_WRONG_CREDENTIALS,
  REGISTERED_TEST_USER,
  GUEST_TEST_USER,
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

  await signinPage.regInputPassword.focus()
  await signinPage.regInputPassword.fill(REGISTERED_TEST_USER.password)
  await expect(signinPage.passwordToggleShow).toBeVisible()
  await expect(signinPage.passwordToggleHide).not.toBeVisible()
  await expect(signinPage.regInputPassword).toHaveAttribute('type', 'password')

  await signinPage.passwordToggleShow.click()
  await expect(signinPage.passwordToggleShow).not.toBeVisible()
  await expect(signinPage.passwordToggleHide).toBeVisible()
  await expect(signinPage.regInputPassword).toHaveValue(
    REGISTERED_TEST_USER.password,
  )
  await expect(signinPage.regInputPassword).toHaveAttribute('type', 'text')
})

test('C2171379 Verify User login reset password flow', async ({
  signinPage,
  header,
  page,
  toastMessage,
}, testInfo) => {
  await test.step('Visit Login page and open Reset password flyout', async () => {
    await header.headerLoginButton.click()
    await signinPage.resetPasswordButton.waitFor()
    await signinPage.resetPasswordButton.click()
    await signinPage.resetPasswordHeadline.waitFor()
    await expect(signinPage.resetPasswordHeadline).toBeVisible()
    await expect(signinPage.resetPasswordEmailInput).toHaveValue('')
  })
  await test.step('Click Get Reset Link button while e-mail address input is empty', async () => {
    await signinPage.resetPasswordGetResetLinkButton.click()
    await expect(signinPage.resetPasswordEmailInput).toBeFocused()
    await expect(signinPage.resetPasswordHeadline).toBeVisible()
  })
  await test.step('Click Back to Login button and assert Flyout is closed', async () => {
    await signinPage.resetPasswordBackToLoginButton.waitFor()
    await signinPage.resetPasswordBackToLoginButton.focus()
    await signinPage.resetPasswordBackToLoginButton.click()
    await expect(signinPage.resetPasswordHeadline).not.toBeVisible()
  })
  await test.step('Enter incorrect format e-mail, open the Flyout and assert e-mail input is empty', async () => {
    await signinPage.emailInput.waitFor()
    await signinPage.emailInput.focus()
    await signinPage.emailInput.fill(LOGIN_WRONG_CREDENTIALS.emailInvalidFormat)
    await signinPage.resetPasswordButton.click()
    await signinPage.resetPasswordHeadline.waitFor()
    await expect(signinPage.resetPasswordEmailInput).toHaveValue('')
  })
  await test.step('Enter correct format non-existing e-mail and click Get Reset Link', async () => {
    await signinPage.resetPasswordEmailInput.clear()
    await signinPage.resetPasswordEmailInput.focus()
    await signinPage.resetPasswordEmailInput.fill(LOGIN_WRONG_CREDENTIALS.email)
    await signinPage.resetPasswordGetResetLinkButton.click()
    await page.waitForTimeout(500)
    await expect(signinPage.forgotPasswordErrorMessageContainer).toBeVisible()
  })
  if (testInfo.project.name === 'firefox') {
    await signinPage.closePasswordResetFlyoutButton.click()
    console.warn(
      'Skipping this step in Firefox due to the potential Firefox specific error - Target page, context or browser has been closed',
    )
  } else {
    await test.step('Enter correct format existing e-mail and click Get Reset Link', async () => {
      await signinPage.resetPasswordEmailInput.clear()
      await page.waitForTimeout(300)
      await signinPage.resetPasswordEmailInput.focus()
      await signinPage.resetPasswordEmailInput.fill(LOGGED_IN_USER_DATA.email)
      await signinPage.resetPasswordGetResetLinkButton.click()
      await signinPage.emailInput.waitFor()
      await page.waitForLoadState('networkidle')
      await toastMessage.toastInfo.waitFor()
      await expect(toastMessage.toastInfo).toBeVisible()
      await expect(signinPage.resetPasswordHeadline).not.toBeVisible()
    })
  }
  await test.step('Open the Flyout and assert Close button', async () => {
    if (isMobile(page)) {
      console.warn(
        'Skipping assert Flyout close button because it is not used on mobile devices',
      )
    } else {
      await signinPage.resetPasswordButton.click()
      await signinPage.closePasswordResetFlyoutButton.waitFor()
      await signinPage.closePasswordResetFlyoutButton.click()
      await page.waitForTimeout(500)
      await expect(signinPage.resetPasswordHeadline).not.toBeVisible()
    }
  })
})

test('C2171786 Verify setting the new password', async ({
  signinPage,
  page,
}) => {
  await test.step('Open new password flyout and enter incorrectly formatted password', async () => {
    // Any hash can be used for the testing purposes to verify that the new password flyout loads correctly.
    await page.goto('/signin?hash=testhash')
    await page.waitForTimeout(500)
    await signinPage.newPasswordInput.waitFor()
    await signinPage.newPasswordInput.focus()
    await signinPage.newPasswordInput.fill('test')
    await expect(signinPage.validationErrorText).toBeVisible()
  })
  await test.step('Enter correctly formatted password', async () => {
    // Error message is expected because the test hash is used.
    await signinPage.newPasswordInput.clear()
    await signinPage.newPasswordInput.focus()
    await signinPage.newPasswordInput.fill(LOGGED_IN_USER_DATA.password)
    await signinPage.submitNewPasswordButton.click()
    await page.waitForTimeout(500)
    await expect(signinPage.validationErrorText).not.toBeVisible()
    await expect(signinPage.resetPasswordErrorMessageContainer).toBeVisible()
  })
})

test('C2171374 Verify User registration guest flow', async ({
  signinPage,
  page,
  header,
  toastMessage,
}) => {
  await test.step('Open Registration page and assert Password input is visible', async () => {
    await header.headerLoginButton.waitFor()
    await header.headerLoginButton.click()
    await signinPage.registerTab.waitFor()
    await signinPage.registerTab.click()
    await signinPage.registerForm.waitFor()
    await expect(signinPage.regInputPassword).toBeVisible()
  })
  await test.step('Enter correctly formatted user data', async () => {
    await signinPage.selectGender('m')
    await signinPage.fillRegistrationData(
      GUEST_TEST_USER.firstName,
      GUEST_TEST_USER.lastName,
      GUEST_TEST_USER.emailAddress,
      GUEST_TEST_USER.password,
    )
    await expect(signinPage.registerGuestInfo).not.toBeVisible()
  })
  await test.step('Click Continue as Guest toggle and assert guest info box is displayed', async () => {
    await signinPage.registerGuestSwitch.click()
    await page.waitForLoadState('domcontentloaded')
    await expect(signinPage.passwordInput).not.toBeVisible()
    await expect(signinPage.registerGuestInfo).toBeVisible()
  })
  await test.step('Click Register button and assert guest user is logged in', async () => {
    await signinPage.registerButton.click()
    await expect(toastMessage.toastInfo).toBeVisible()
    if (!isMobile(page)) {
      await page.waitForLoadState('domcontentloaded')
      await header.headerLoginButton.hover()
      await page.waitForLoadState('domcontentloaded')
      await expect(signinPage.greetingUserFirstName).toBeVisible()
      await expect(signinPage.userPopoverEmail).toBeVisible()
      await expect(signinPage.userPopoverLogoutButton).toBeVisible()
    }
  })
})
