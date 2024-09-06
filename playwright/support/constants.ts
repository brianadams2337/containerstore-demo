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

export const LIGHTHOUSE_THRESHOLDS = {
  performance: 80,
  accessibility: 80,
  seo: 80,
  bestPractices: 80,
}

export const PLP_FILTER_DEEPLINK = {
  sale: true,
  size: 22,
  brand: 2259,
  maxPrice: 4000,
}

export const PLP_PATH_MAIN_CATEGORY = '/frauen-50337'
export const PLP_PATH_SUBCATEGORY_LVL_1 = '/c/frauen/bekleidung-50338'
export const PLP_PATH_SUBCATEGORY_LVL_2 = '/c/frauen/sneaker/sneaker-low-50347'
export const PLP_BASE_PATH = /\/c/
export const PLP_SIBLING_TEST_PRODUCT_PATH = /\/p\/sneaker-gazelle-bold-206062/
export const PLP_SUBCATEGORY_NAME_DE = 'Bekleidung'

export const SEARCH_SUGGESTIONS = {
  searchTermNoResults: 'noresults',
  searchTermProduct: 'kleider',
  searchTermBrand: 'adidas',
  plpUrl: /\/kleider/,
  searchUrl: /\/search/,
  searchParamUrl: 'search?term=',
  searchExactProductID: '206140',
  pdpUrl: '/p/sneaker-adimatic-206140',
  moreButtonLabelDE: 'Mehr',
}

export const BASKET_TEST_DATA = {
  emptyBasketTitleDE: 'Dein Warenkorb ist leer.',
  emptyBasketSubtitleDE:
    'Du siehst hier eine Auflistung Deiner Produkte sobald sie in deinem Warenkorb sind.',
  productRegularVariantId: 320096,
  productRegularName: `Hose 'Essentials'`,
  productRegularBrand: 'ADIDAS ORIGINALS',
  productNameHappyPath: `Sweatshirt 'ESS'`,
  itemKeyHappyPath: '15e3df16a020df6b0716b0cb351132ac',
  itemKeyBasketE2E: '7dac25e441f1472a2201cd7f493d139c',
}

export const HOMEPAGE_PATH_DE = '/de'
export const SIGNIN_URL = '/signin'

export const FOOTER = {
  linkGroup1: {
    about: '/de/s/about-us',
    shipping: '/de/s/shipping',
    philosophy: '/de',
    imprint: '/de/s/imprint',
  },
  linkGroup2: {
    customerService: '/de',
    faq: '/de/s/faq',
    deliveryReturns: '/de/s/returns',
    cancelSubscription: '/de/account/subscription-cancellations',
  },
  linkGroup3: {
    cookiePolicy: '/de',
    privacyPolicy: '/de',
    termsConditions: '/de/s/imprint',
  },
}

export const USER_WITHOUT_ORDERS = {
  firstName: 'Test',
  lastName: 'User No Orders',
  email: 'sfb.aqa.no-orders@scayle.com',
  password: 'N00rd3rs!',
}
