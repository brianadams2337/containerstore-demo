import { expect, test } from '../fixtures/fixtures'

test('C2130723: Verify PLP standard components', async ({
  homePage,
  mainNavigation,
  productListingPage,
  breadcrumb,
  pagination,
}) => {
  await homePage.visitPage()
  await mainNavigation.menuItemSecond.click()
  await productListingPage.menuRootCategory.first().click()
  await productListingPage.menuSubCategoryLvl1.first().click()
  await productListingPage.menuSubCategoryLvl2.first().click()

  await expect(productListingPage.sortDropdown).toBeVisible()
  await expect(productListingPage.filterButton.first()).toBeVisible()
  await expect(breadcrumb.breadcrumbCategoryLvl0).toBeVisible()
  await expect(breadcrumb.breadcrumbCategoryLvl1).toBeVisible()
  await expect(breadcrumb.breadcrumbCategoryActive).toBeVisible()
  await expect(productListingPage.productItem.first()).toBeVisible()

  await breadcrumb.clickBreadcrumbLvl1()
  await pagination.scrollToPagination()

  await expect(pagination.paginationButton.first()).toBeVisible()
  await expect(breadcrumb.productCounter).toBeVisible()
})
