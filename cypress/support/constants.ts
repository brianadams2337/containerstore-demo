// TODO: there is no such concept in cypress as constants: https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests
// TODO: use Cypress.env instead? See: https://docs.cypress.io/api/cypress-api/env

export const HEADER_TEST_CATEGORY_WOMEN = 'Women/clothing'
export const PLP_CATEGORY_WOMEN = 'Women'
export const TEST_ITEM_REGULAR = {
  link: 'p/pullover-aus-grobstrick-1115',
  id: 1088,
  colorOptionPink: 62,
  name: 'Pullover aus Grobstrick',
  price: '19,90',
  initialPrice: null,
  category: 'women',
}

export const TEST_ITEM_SALE = {
  link: '/p/aqa-testitem-sale-2',
  name: 'AQA-TestItem-Sale',
  price: '36,61',
  initialPrice: '52,30',
  category: 'women',
}

export const TEST_ITEM_SOLDOUT = {
  link: '/p/aqa-testitem-soldout-3',
  id: 3,
  name: 'AQA-TESTITEM-SOLDOUT',
  price: '99.90',
  initialPrice: null,
  category: 'women',
}

export const TEST_ITEM_ONESIZE = {
  link: '/p/tasche-klara-1086',
  name: 'AQA-TestItem-NoSize',
  price: '29,90',
  initialPrice: null,
  category: 'women',
}

export const TEST_ITEM_COMBINE_WITH = {
  link: '/p/tommy-hilfiger-sweatshirt-new-miha-4',
  name: 'Tommy Hilfiger Sweatshirt (New) Miha',
  price: '99,90',
  initialPrice: null,
  category: 'men',
  soldOutProductIdInSlider: 3,
}

export const TEST_ITEM_NO_COMBINE_WITH = {
  link: '/p/pullover-aus-grobstrick-1115',
  name: 'Pullover aus Grobstrick',
  price: '19,90',
  initialPrice: null,
  category: 'women',
}

export const HEADER_TEST_CATEGORY_MEN = 'Men'
export const PLP_CATEGORY_MEN = '/men'

export const HEADER_TEST_CATEGORY_KIDS = 'Kids'
export const PLP_CATEGORY_KIDS = '/kids'

export const HEADER_TEST_CATEGORY_SALE = 'Sale'
export const PLP_CATEGORY_SALE = '/sale'

export const TEST_COLOR = 10

export const TEST_ORDER = {
  delivery: 'Lieferung 1',
  deliveryStartDate: '23.11.2022',
  deliveryEndDate: '23.11.2022',
  address: 'test AQA',
  price: '16',
  size: 'Größe',
  quantity: 'Anzahl: 1',
  deliveryCost: 'Kostenlos',
  paymentMethod: 'accounting',
}

// logged in User:
export const LOGGED_IN_USER_DATA = {
  firstName: 'test',
  lastName: 'AQA',
  email: 'AQA@aboutyou.com',
  password: 'Aqa-temp-pass!',
}
export const LOGGED_IN_USER_SESSION =
  's%3A124%3A06241d0f-a813-4658-b361-f7fcacce0d08.u1Bro%2FspNawS0bU8UpHSuTN2siqLOIlsnN2EzMHuHyI'
