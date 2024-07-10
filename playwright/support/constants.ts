export const E2E_BASKET_URL = /\/basket/
export const E2E_CHECKOUT_URL = /\/checkout/

export const LOGGED_IN_USER_DATA = {
  firstName: 'test',
  lastName: 'AQA',
  email: 'AQA@aboutyou.com',
  password: 'Aqa-temp-pass!',
}

export const LOGIN_WRONG_CREDENTIALS = {
  firstName: 'test',
  lastName: 'test',
  email: 'Aqa.testxx@test.com',
  password: 'Aqa-wrong-pass',
}

export const TEST_ITEM_REGULAR = {
  link: 'p/batist-blusentop-1099',
  id: 1099,
  colorOptionPink: 62,
  name: 'Batist-Blusentop',
  price: '34,00',
  initialPrice: null,
  category: 'women',
  brand: 's.Oliver',
}

export const lighthouseThresholds = {
  performance: 80,
  accessibility: 80,
  seo: 80,
  bestPractices: 80,
}
