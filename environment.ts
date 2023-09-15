import { bool, cleanEnv, defaultReporter, num, host, str, url } from 'envalid'
import yn from 'yn'

export default cleanEnv(
  process.env,
  {
    BASE_URL: url(),

    REDIS_HOST: host({ default: 'localhost' }),
    REDIS_PORT: num({ default: 6379 }),
    REDIS_PREFIX: str({ default: '' }),

    BAPI_HOST: url(),
    BAPI_TOKEN: str(),

    AY_CACHE_DISABLED: bool({ default: false }),

    DOMAIN_EN: str({ default: '' }),
    DOMAIN_DE_DE: str({ default: '' }),
    DOMAIN_DE_AT: str({ default: '' }),
    DOMAIN_DE_CH: str({ default: '' }),
    DOMAIN_DEFAULT: str({ default: '' }),
    DOMAIN_PER_LOCALE: bool({ default: true }),

    CHECKOUT_HOST: str({ default: '' }),
    CHECKOUT_TOKEN_1001: str(),
    CHECKOUT_SECRET_1001: str(),
    CHECKOUT_USER_1001: str(),
    CHECKOUT_ACCESS_HEADER: str({ default: undefined }),
    IS_LOWEST_PREVIOUS_PRICE_ACTIVE_1001: bool({ default: false }),

    OAUTH_API_HOST: str({ default: '' }),
    OAUTH_CLIENT_ID: str({ default: '' }),
    OAUTH_CLIENT_SECRET: str({ default: '' }),

    BASIC_AUTH: str({ default: '' }),

    CAMPAIGN_KEY_PREFIX: str(),

    HTTPS_KEY: str({ default: '' }),
    HTTPS_CERT: str({ default: '' }),

    GOOGLE_TAG_MANAGER_ID: str({ default: '' }),

    STORYBLOK_ACCESS_TOKEN: str(),
    STORYBLOK_WEBHOOK_SECRET: str({
      default: 'hereupon-caviar-nicety-wanton',
    }),

    SENTRY_DSN: str({ default: '' }),
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
