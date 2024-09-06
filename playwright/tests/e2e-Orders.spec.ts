import { expect, test } from '../fixtures/fixtures'
import { LOGGED_IN_USER_DATA, USER_WITHOUT_ORDERS } from '../support/constants'

test('C2132533 Verify Orders page - user has orders', async ({
  ordersPage,
  homePage,
  accountPage,
  baseURL,
}) => {
  await homePage.visitPage()
  await accountPage.userAuthentication(
    LOGGED_IN_USER_DATA.email,
    LOGGED_IN_USER_DATA.password,
  )
  await ordersPage.visitOrdersPage('/account/orders', baseURL as string)
  await expect(async () => {
    await ordersPage.assertOrderListItem()
    await ordersPage.assertOrderItem()
    await ordersPage.assertPaymentArea()
  }).toPass()
})

test('C2132126 Verify Orders page - user without orders', async ({
  ordersPage,
  homePage,
  accountPage,
  baseURL,
}) => {
  await homePage.visitPage()
  await accountPage.userAuthentication(
    USER_WITHOUT_ORDERS.email,
    USER_WITHOUT_ORDERS.password,
  )
  await ordersPage.visitOrdersPage('/account/orders', baseURL as string)
  await expect(async () => {
    await expect(ordersPage.headlineNoOrders).toBeVisible()
    await expect(ordersPage.buttonContinueShopping).toBeVisible()
  }).toPass()
})
