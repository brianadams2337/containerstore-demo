import { TEST_ITEM_REGULAR } from '../../support/constants'
import Footer from '../../pageObjects/components/footer'
import ProductPage from '../../pageObjects/productPage'

describe('Footer', () => {
  afterEach(() => {
    cy.clearSiteData()
  })

  it('click on FAQ', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.openFaq()
  })

  it('click on Imprint page', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.openImprint()
  })

  it('check Storyblok content', () => {
    ProductPage.openProduct(TEST_ITEM_REGULAR.link)
    ProductPage.waitForPageToBeDisplayed()
    Footer.assertFooterIsDisplayed()
    Footer.assertStoryblokContent()
  })
})
