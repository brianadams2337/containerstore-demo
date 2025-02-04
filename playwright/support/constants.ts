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
  password: process.env.TEST_USER_WRONG_PASSWORD as string,
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
  performance: 50, // 80
  accessibility: 70, // 80
  seo: 50, // 80
  bestPractices: 90, // 80
}

export const PLP_FILTER_DEEPLINK = {
  sale: true,
  size: 2272,
  maxPrice: 4000,
}

export const PLP_PATH_MAIN_CATEGORY = '/de/c/frauen-50337'
export const PLP_PATH_SUBCATEGORY_LVL_1 = '/de/c/frauen/bekleidung-50338'
export const PLP_PATH_SUBCATEGORY_LVL_2 =
  '/de/c/frauen/sneaker/sneaker-low-50347'
export const PLP_BASE_PATH = /\/c/
export const PLP_SIBLING_TEST_PRODUCT_PATH = /\/p\/sneaker-gazelle-bold-206062/
export const PLP_SUBCATEGORY_NAME_DE = 'Bekleidung'

export const SEARCH_SUGGESTIONS = {
  searchTermNoResults: 'noresults',
  searchTermProduct: 'kleider',
  searchTermBrand: 'adidas',
  plpUrl: /\/kleider/,
  searchUrl: /\/search/,
  searchParamUrl: 'search?filters[term]=',
  searchExactProductID: '206140',
  pdpUrl: '/p/sneaker-adimatic-206140',
  moreButtonLabelDE: 'Mehr',
  searchTermTags: 'sneaker size 40',
  searchTestTagValue: '40',
}

export const BASKET_TEST_DATA = {
  emptyBasketTitleDE: 'Dein Warenkorb ist leer.',
  emptyBasketSubtitleDE:
    'Du siehst hier eine Auflistung deiner Produkte sobald sie in deinem Warenkorb sind.',
  productRegularVariantId: 320096,
  productRegularName: `Hose 'Essentials'`,
  productRegularBrand: 'ADIDAS ORIGINALS',
  productNameHappyPath: 'Jacke',
  itemKeyHappyPath: '15e3df16a020df6b0716b0cb351132ac',
  itemKeyBasketE2E: '7dac25e441f1472a2201cd7f493d139c',
  regularPriceVariantId: 334103,
  salePriceVariantId: 335845,
  promotionPriceProductId: '205808',
}

export const HOMEPAGE_PATH_DE = '/de'
export const HOMEPAGE_PATH_EN = '/en'
export const SIGNIN_URL = '/signin'
export const WISHLIST_PRODUCT_ID = 205651
export const WISHLIST_PRODUCT_ID_ONESIZE = 206042

export const USER_ACCOUNT = {
  accountUserPath: '/de/account/user',
  userFirstName: 'Aqa',
  userLastName: 'Test',
  userBirthDateCorrect: '30.05.1981',
  userBirthDateIncorrect: '32.13.9999',
  nonMatchingPassword: 'N0nMatch1ngPa55w0rd!',
}

export const FOOTER = {
  linkGroup1: {
    scayleStorefront: '/de/s/about',
    scayle: 'https://www.scayle.com/',
    storefrontGuide:
      'https://scayle.dev/en/storefront-guide/developer-guide/getting-started/what-is-storefront',
    cmsComponents: '/de/content/cms-component-showcase',
  },
  linkGroup2: {
    faq: '/de/s/faq',
    helpdesk:
      'https://github.com/scayle/storefront-boilerplate-support/discussions',
    shipping: '/de/s/shipping',
    returns: '/de/s/returns',
  },
  linkGroup3: {
    termsConditions: '/de/s/agb',
    privacyPolicy: '/de/s/data-privacy',
    imprint: '/de/s/imprint',
  },
  linkGroup4: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    pinterest: 'https://pinterest.com/',
    tiktok: 'https://www.tiktok.com/',
    youtube: 'https://www.youtube.com/',
  },
}

export const USER_WITHOUT_ORDERS = {
  firstName: 'Test',
  lastName: 'User No Orders',
  email: 'sfb.aqa.no-orders@scayle.com',
  password: process.env.TEST_USER_NO_ORDERS_PASSWORD as string,
}

export const CHECKOUT_URL = '/checkout'

export const PDP_E2E = {
  regularProductUrl: '/p/sweatshirt-205801',
  regularProductVariantId: '334840',
  oneSizeProductId: '206025',
  oneSizeProductUrl: '/p/umhangetasche-adicolor-classic-206025',
  subscribeProductUrl: '/p/sneaker-forum-bold-206136',
  subscribeProductVariantId: '333734',
  subscribeNotEligibleVariantId: '333740',
  happyPathProductUrl: '/de/p/jacke-205696',
  happyPathProductVariantId: '337629',
}

export const LIGHTHOUSE_AUDIT_PATHS = {
  plp: '/de/c/frauen/bekleidung-50338',
  pdp: '/de/p/jacke-205696',
}

export const TEST_USERS = {
  testUserEmail1: process.env.TEST_USER_EMAIL as string,
  testUserEmail2: process.env.TEST_USER_EMAIL2 as string,
  testUserEmail3: process.env.TEST_USER_EMAIL3 as string,
  testUserEmail4: process.env.TEST_USER_EMAIL4 as string,
  testUserEmail5: process.env.TEST_USER_EMAIL5 as string,
  testUserPassword: process.env.TEST_USER_PASSWORD as string,
}

export const LIGHTHOUSE_VIEWPORT_SIZE = Number.parseInt(
  process.env.LIGHTHOUSE_VIEWPORT_SIZE as string,
)

export const LOCATION = {
  city: 'hamburg',
  zipCode: '20095',
  zipCodeInvalid: '000000000',
}

export const SORTING = {
  topSeller: 'top_seller',
  dateNewest: 'date_newest',
  priceDesc: 'price_desc',
  priceAsc: 'price_asc',
  reductionDesc: 'reduction_desc',
}

export const NAVIGATION_TEST_ITEMS = {
  mainCategory: 'Frauen',
  categoryLevel2: 'Bekleidung',
  categoryLevel3: 'Kleider',
  shopName: 'SCAYLE',
}

export const CHECKOUT_REDIRECT_URL = 'signin?redirectUrl=/de/checkout'

export const HYDRATION_TEST_USER = {
  userEmail: process.env.TEST_USER_EMAIL6 as string,
  password: process.env.TEST_USER_PASSWORD as string,
}
