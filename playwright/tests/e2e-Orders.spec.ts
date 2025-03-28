import { expect, test } from '../fixtures/fixtures'
import {
  LOGGED_IN_USER_DATA,
  ROUTES,
  USER_WITHOUT_ORDERS,
} from '../support/constants'

test('C2132533 Verify Orders for user that has orders', async ({
  ordersPage,
  homePage,
  accountPage,
  baseURL,
  page,
}) => {
  await test.step('Visit Orders page and assert the page is loaded', async () => {
    await homePage.visitPage()
    await page.waitForLoadState('networkidle')
    await accountPage.userAuthentication(
      LOGGED_IN_USER_DATA.email,
      LOGGED_IN_USER_DATA.password,
    )
    await ordersPage.visitOrdersPage('/account/orders', baseURL as string)
    await ordersPage.ordersHeadline.waitFor()
    await expect(ordersPage.ordersHeadline).toBeVisible()
  })
  await test.step('Open the first order and check order details', async () => {
    const orderHeadlineText = (await ordersPage.orderItemHeadline
      .nth(0)
      .textContent()) as string
    const orderNumber = orderHeadlineText.split(': ')[1]
    await ordersPage.selectOrder(orderNumber)
    await ordersPage.orderDetailsHeadline.waitFor()
    await expect(ordersPage.orderDetailsHeadline).toContainText(orderNumber)
    expect(page.url()).toContain(orderNumber)
  })
  await test.step('Go back to orders list', async () => {
    await ordersPage.orderDetailsBackButton.click()
    await ordersPage.ordersHeadline.waitFor()
    expect(page.url()).toContain(ROUTES.orders)
  })
  await test.step('Check the pagination', async () => {})
  await ordersPage.selectPage('2')
  await page.waitForTimeout(500)
  expect(page.url()).toContain('?page=2')
})

test('C2132126 Verify Orders page - user without orders', async ({
  ordersPage,
  homePage,
  accountPage,
  baseURL,
  page,
}) => {
  await homePage.visitPage()
  await page.waitForLoadState('networkidle')
  await accountPage.userAuthentication(
    USER_WITHOUT_ORDERS.email,
    USER_WITHOUT_ORDERS.password,
  )
  await ordersPage.visitOrdersPage('/account/orders', baseURL as string)
  await expect(ordersPage.emptyState).toBeVisible()
  await expect(ordersPage.buttonContinueShopping).toBeVisible()
})
