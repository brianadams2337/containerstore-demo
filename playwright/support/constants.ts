export const E2E_BASKET_URL = /\/basket/

export const LOGGED_IN_USER_DATA = {
  firstName: 'test',
  lastName: 'AQA',
  email: process.env.TEST_USER_EMAIL as string,
  password: process.env.TEST_USER_PASSWORD as string,
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

export const plpFilterDeeplink = {
  sale: true,
  size: 2272,
  material: 2273,
  maxPrice: 4000,
}

export const plpPath = '/c/frauen/bekleidung-50338'

export const searchSuggestions = {
  searchTermNoResults: 'noresults',
  searchTermProduct: 'kleider',
  searchTermBrand: 'adidas',
  plpUrl: /\/kleider/,
  searchUrl: /\/search/,
  searchParamUrl: 'search?term=',
  searchExactProductID: '206140',
  pdpUrl: '/p/sneaker-adimatic-206140',
}
