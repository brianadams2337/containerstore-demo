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
  emailInvalidFormat: 'test@test',
}

export const LIGHTHOUSE_THRESHOLDS = {
  performance: 50, // 80
  accessibility: 70, // 80
  seo: 50, // 80
  bestPractices: 90, // 80
}

export const PLP_FILTER_DEEPLINK = {
  sale: true,
  maxPrice: 4000,
}

/**
 * SEARCH constant object defines various search-related constants used in end-to-end tests.
 * This object centralizes search terms and URL parameters to ensure consistency
 * and easier configuration across different test scenarios. Using environment
 * variables allows for flexible test data management across various environments.
 */
export const SEARCH = {
  /** Product search term, e.g. product brand or name that doesn't match a category or page name, so the search suggestions are not displayed */
  searchTermProduct: process.env.E2E_SEARCH_TERM_PRODUCT,
  /** Category suggestion search term that partially or fully matches category name, e.g. "shirt" or "shirts". */
  searchTermCategorySuggestion: process.env.E2E_SEARCH_TERM_CATEGORY_SUGGESTION,
  /** Product ID search term that matches exact product ID in stock, e.g. 123456. */
  searchExactProductID: process.env.E2E_SEARCH_EXACT_PRODUCT_ID,
  /** Suggestion tags search term that describes the product and returns its descriptive tags, e.g. "Black shoes size 44". */
  searchTermTags: process.env.E2E_SEARCH_TAGS,
  /** Page name search term that fully or partially matches a content page, e.g. "faq" or "support". */
  searchTermPage: process.env.E2E_SEARCH_PAGE,
  /** Reference Key search term that matches exact product Reference Key in stock, e.g. "123-ref-key". */
  searchReferenceKey: process.env.E2E_SEARCH_REFERENCE_KEY,
  /** The base URL parameter used for search queries. It doesn't require any setup via environment variable. */
  searchParamUrl: 'search?filters[term]=',
}

export const BASKET_TEST_DATA = {
  regularPriceVariantId: 334103,
  salePriceVariantId: 336068,
  promotionPriceProductId: '205808',
  soldOutProductUser: process.env.TEST_USER_EMAIL7 as string,
  soldOutProductPassword: process.env.TEST_USER_PASSWORD as string,
  productAvailableLessThanTen: 319859,
  productAvailableMoreThanTen: 333231,
  promoPaidProduct: 333618,
  promoFreeProduct: 336349,
  freeProductPriceLabel: ' 0,00 € ',
  seoRobots: 'noindex,follow',
}

export const HOMEPAGE_PATH_DE = '/de'
export const HOMEPAGE_PATH_EN = '/en'
export const SIGNIN_URL = '/signin'

export const USER_ACCOUNT = {
  userFirstName: 'Aqa',
  userLastName: 'Test',
  userBirthDateCorrect: '30.05.1981',
  userBirthDateIncorrect: '32.13.9999',
  nonMatchingPassword: 'N0nMatch1ngPa55w0rd!',
  routeOrders: '/account/orders',
  routeSubscriptions: '/account/subscription',
  routeProfile: '/account/profile',
}

export const CHECKOUT_URL = '/checkout'

export const PDP_E2E = {
  regularProductUrl: '/p/sweatshirt-205801',
  oneSizeProductUrl: '/p/umhangetasche-adicolor-classic-206025',
  subscribeProductUrl: '/p/sneaker-forum-bold-206136',
  subscribeNotEligibleVariantId: '333740',
  seoRobots: 'index, follow',
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
  testUserNoOrders: process.env.TEST_USER_NO_ORDERS as string,
  testUserNoOrdersPass: process.env.TEST_USER_NO_ORDERS_PASSWORD as string,
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

export const CHECKOUT_REDIRECT_URL = 'signin?redirectUrl=/de/checkout'

export const HYDRATION_TEST_USER = {
  userEmail: process.env.TEST_USER_EMAIL6 as string,
  password: process.env.TEST_USER_PASSWORD as string,
}

export const REGISTERED_TEST_USER = {
  firstName: 'Registered',
  lastName: 'User',
  emailAddress: process.env.TEST_USER_EMAIL as string,
  password: process.env.TEST_USER_PASSWORD as string,
}

export const ROUTES = {
  wishlist: '/wishlist',
  basket: '/basket',
  orders: '/orders',
}

export const GUEST_TEST_USER = {
  firstName: 'Guest',
  lastName: 'User',
  emailAddress: process.env.TEST_USER_GUEST as string,
  password: process.env.TEST_USER_PASSWORD as string,
}

export const PDP_TEST_VARIANT_ID = {
  multiSizeProductUrl: '/p/between-season-jacket-premium-205632',
  availableVariantId: '334990',
  availableVariantId2: '334992',
  availableSize: '32',
  availableSize2: '36',
  oneSizeProductUrl: '/p/umhangetasche-adicolor-classic-206008',
  oneSizeProductUrl2: '/p/umhangetasche-adicolor-classic-206025',
  oneSizeVariantId: '333316',
  soldOutVariantUrl: '/p/between-season-jacket-premium-205632?variantId=334988',
  soldOutVariantSize: '28',
}

export const OSP_TEST_DATA = {
  ordersUrl: '/orders',
  incorrectCbdUrl:
    '/success?cbd=eyJzdGF0dXNTg1NTI3Y2I3NjY0NWQ3NA==&login=1&pmm=b2b',
  seoRobots: 'noindex,nofollow',
}

export const LOGIN_REGISTRATION = {
  seoRobots: 'noindex,follow',
  regUrlParam: 'register=true',
}

export const PLP_TEST_DATA = {
  seoRobotsDefault: 'index,follow',
  seoRobotsFiltersSorting: 'noindex,follow',
}

export const WISHLIST_TEST_DATA = {
  seoTitle: 'Deine Wunschliste | SCAYLE',
  seoRobots: 'noindex, nofollow',
}
