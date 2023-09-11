import { HashAlgorithm, ModuleOptions } from '@scayle/storefront-nuxt'
import environment from '../environment'
import * as customRpcMethods from '../rpcMethods'
import withParams from '../constants/withParams'

const baseShopConfig = {
  domain: environment.DOMAIN_DEFAULT,
  paymentProviders: [
    'lastschrift',
    'visa',
    'mastercard',
    'discover',
    'diners',
    'ratepay',
    'klarna',
    'paypal',
  ],
  storeCampaignKeyword: environment.CAMPAIGN_KEY_PREFIX,
  appKeys: {
    wishlistKey: 'wishlist_{shopId}_{userId}',
    basketKey: 'basket_{shopId}_{userId}',
    hashAlgorithm: HashAlgorithm.SHA256,
  },
}

type RpcMethodsStorefrontType = typeof customRpcMethods
declare module '@scayle/storefront-nuxt' {
  export interface RpcMethodsStorefront extends RpcMethodsStorefrontType {}

  // Extend the shop config
  export interface AdditionalShopConfig {
    paymentProviders: string[]
    appKeys: (typeof baseShopConfig)['appKeys']
  }
}

// TODO: Make sure BAPI and CO can work with multiple shops
const shops = [
  {
    locale: 'en-US',
    path: 'en',
    shopId: 1001, // 1028,
    currency: 'USD',
  },
  {
    locale: 'de-DE',
    path: 'de',
    shopId: 1001,
    currency: 'EUR',
  },
]

const protocol =
  (environment.HTTPS_KEY && environment.HTTPS_CERT) ||
  process.env.NODE_ENV === 'production'
    ? 'https://'
    : 'http://'

const options: Partial<ModuleOptions> = {
  bapi: {
    host: environment.BAPI_HOST,
    token: environment.BAPI_TOKEN,
    // TODO: Is shopId required here for tenants that need to separate shop/customer data?
  },
  withParams,
  rpcMethodNames: Object.keys(customRpcMethods),
  publicShopData: ['paymentProviders'],
  shopSelector: environment.DOMAIN_PER_LOCALE ? 'domain' : 'path',
  stores: shops.map((shop) => ({
    ...baseShopConfig,
    shopId: shop.shopId,
    path: shop.path,
    locale: shop.locale,
    auth: {
      resetPasswordUrl: `${protocol}${shop.locale}/signin/`,
    },
    currency: shop.currency,
    checkout: {
      shopId: shop.shopId,
      // Checkout probably isn't configured for the non-DE shops
      // but the main goal is testing storefront
      token: environment.CHECKOUT_TOKEN_1001,
      secret: environment.CHECKOUT_SECRET_1001,
      host: environment.CHECKOUT_HOST,
      user: environment.CHECKOUT_USER_1001,
    },
  })),
  redis: {
    host: environment.REDIS_HOST,
    port: environment.REDIS_PORT,
    prefix: environment.REDIS_PREFIX,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
  log: {
    name: 'storefront-boilerplate-nuxt',
  },
  cache: {
    auth: {
      username: 'max',
      password: 'mustermann',
    },
    // TODO: Check following if required:
    // enabled: process.env.AY_CACHE_DISABLED !== 'true',
    // ttl: 60 * 60,
    // sendCacheControlHeaders: true,
    // maxAge: 60 * 60,
    // staleWhileRevalidate: 60 * 60 * 24,
    // generateCacheKey: () =>
  },
  session: {
    sameSite: process.env.APP_ENV !== 'production' ? 'none' : 'lax',
    maxAge: 2419200000, // four weeks in milliseconds
  },
  imageBaseUrl: 'https://brb-demo.cdn.aboutyou.cloud/',
}

export default options
