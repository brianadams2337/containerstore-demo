import { test as base } from '@playwright/test'
import { HomePage } from '../page-objects/homePage'
import { MainNavigation } from '../page-objects/components/mainNavigation'
import { ProductListingPage } from '../page-objects/productListingPage'
import { ProductDetailPage } from '../page-objects/productDetailPage'
import { Header } from '../page-objects/components/header'
import { BasketPage } from '../page-objects/basketPage'
import { SignInPage } from '../page-objects/signinPage'
import { CheckoutPage } from '../page-objects/checkoutPage'
import { AccountPage } from '../page-objects/accountPage'
import { ToastMessage } from '../page-objects/components/toastMessage'

interface Fixtures {
  homePage: HomePage
  mainNavigation: MainNavigation
  productListingPage: ProductListingPage
  productDetailPage: ProductDetailPage
  header: Header
  basketPage: BasketPage
  signinPage: SignInPage
  checkoutPage: CheckoutPage
  accountPage: AccountPage
  toastMessage: ToastMessage
}

export type OutputMode = 'json' | 'html' | 'csv'

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await use(homePage)
  },
  mainNavigation: async ({ page }, use) => {
    const mainNavigation = new MainNavigation(page)
    await use(mainNavigation)
  },
  productListingPage: async ({ page }, use) => {
    const productListingPage = new ProductListingPage(page)
    await use(productListingPage)
  },
  productDetailPage: async ({ page }, use) => {
    const productDetailPage = new ProductDetailPage(page)
    await use(productDetailPage)
  },
  header: async ({ page }, use) => {
    const header = new Header(page)
    await use(header)
  },
  basketPage: async ({ page }, use) => {
    const basketPage = new BasketPage(page)
    await use(basketPage)
  },
  signinPage: async ({ page }, use) => {
    const signinPage = new SignInPage(page)
    await use(signinPage)
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page)
    await use(checkoutPage)
  },
  accountPage: async ({ page }, use) => {
    const accountPage = new AccountPage(page)
    await use(accountPage)
  },
  toastMessage: async ({ page }, use) => {
    const toastMessage = new ToastMessage(page)
    await use(toastMessage)
  },
})
export { expect } from '@playwright/test'
