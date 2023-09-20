import { bool, cleanEnv, defaultReporter, num, host, str, url } from 'envalid'
import yn from 'yn'

export default cleanEnv(
  process.env,
  {
    /** Global Configuration */
    BASE_URL: url(),
    NUXT_PUBLIC_IMAGE_BASE_URL: url({ default: 'https://brb-demo.cdn.aboutyou.cloud/' }),

    AY_CACHE_DISABLED: bool({ default: false }),

    NUXT_CHECKOUT_ACCESS_HEADER: str({ default: undefined }),

    NUXT_STOREFRONT_REDIS_HOST: host({ default: 'localhost' }),
    NUXT_STOREFRONT_REDIS_PORT: num({ default: 6379 }),
    NUXT_STOREFRONT_REDIS_PREFIX: str({ default: '' }),

    NUXT_STOREFRONT_REDIRECTS_ENABLED: bool({ default: false }),

    NUXT_STOREFRONT_BAPI_HOST: url(),
    NUXT_STOREFRONT_BAPI_TOKEN: str(),

    NUXT_STOREFRONT_OAUTH_API_HOST: str({ default: '' }),
    NUXT_STOREFRONT_OAUTH_CLIENT_ID: str({ default: '' }),
    NUXT_STOREFRONT_OAUTH_CLIENT_SECRET: str({ default: '' }),

    NUXT_STOREFRONT_DOMAIN_EN: str({ default: '' }),
    NUXT_STOREFRONT_DOMAIN_DE_DE: str({ default: '' }),
    NUXT_STOREFRONT_DOMAIN_DE_AT: str({ default: '' }),
    NUXT_STOREFRONT_DOMAIN_DE_CH: str({ default: '' }),
    NUXT_STOREFRONT_DOMAIN_DEFAULT: str({ default: '' }),
    NUXT_STOREFRONT_DOMAIN_PER_LOCALE: bool({ default: true }),

    NUXT_PUBLIC_GTM_ID: str({ default: '' }),

    /* Store-specific Configuration */
    // NOTE: Replace {YOUR_SHOP_ID} with your actual shopId or if you need to support
    // multiple shop with the same shopId, use your locale value (e.g. EN_US or DE_DE).
    // We only need a set of default value here to be prefilled during buildtime,
    // actual configuration will haben through environment variables.
    // See .env for potential environment variables setup

    // DE_DE / 1001
    NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_HOST: str({ default: '' }),
    NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_TOKEN: str(),
    NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_SECRET: str(),
    NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_USER: str(),

    NUXT_STOREFRONT_STORES_EN_US_CAMPAIGN_KEYWORD: str(),

    NUXT_STOREFRONT_STORES_EN_US_IS_LOWEST_PREVIOUS_PRICE_ACTIVE: bool({ default: false }),

    /* Storyblok-specific Configuration */
    NUXT_STORYBLOK_ACCESS_TOKEN: str(),
    NUXT_STORYBLOK_WEBHOOK_SECRET: str({
      default: 'hereupon-caviar-nicety-wanton',
    }),

    /* Sentry-specific Configuration */
    NUXT_SENTRY_DSN: str({ default: '' }),

    /* Local Development */
    HTTPS_KEY: str({ default: '' }),
    HTTPS_CERT: str({ default: '' }),
  },
  {
    reporter: (options) => {
      if (yn(process.env.CI)) {
        return
      }

      defaultReporter(options)
    },
  },
)
