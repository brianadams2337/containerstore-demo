import { test } from '../fixtures/fixtures'
import pages from '../support/pages-hydration-check.json'
import { HYDRATION_TEST_USER } from '../support/constants'

const userStates = ['guest', 'loggedIn']

for (const userState of userStates) {
  test.describe(`Hydration Tests (${userState} user)`, () => {
    for (const [pageName, path] of Object.entries(
      pages[userState as keyof typeof pages],
    )) {
      test(`Verify hydration errors on ${pageName}`, async ({
        page,
        baseURL,
        accountPage,
      }) => {
        page.on('console', (message) => {
          if (
            (message.type() === 'warning' || message.type() === 'error') &&
            /hydration/i.test(message.text())
          ) {
            const args = message.args()
            const formattedArgs = args.map((arg) => arg.toString()).join(' ')
            throw new Error(
              `Hydration problem detected: ${message.text()}\nArguments: ${formattedArgs}`,
            )
          }
        })

        await page.goto(`${baseURL}${path}`, { waitUntil: 'commit' })
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(1500)
        if (userState === 'loggedIn') {
          await accountPage.userAuthentication(
            HYDRATION_TEST_USER.userEmail,
            HYDRATION_TEST_USER.password,
          )
        }
        await page.reload()
        await page.waitForLoadState('networkidle')
      })
    }
  })
}
