import { bool, cleanEnv, defaultReporter, num, host, str, url } from 'envalid'
import yn from 'yn'

export default cleanEnv(
  process.env,
  {
    BASE_URL: url(),
    REDIS_HOST: host({ default: 'localhost' }),
    REDIS_PORT: num({ default: 6379 }),
    REDIS_PREFIX: str({ default: '' }),
    REDIS_SSL_TRANSIT: bool({ default: false }),

    BAPI_HOST: url(),
    BAPI_TOKEN: str(),

    AY_CACHE_DISABLED: bool({ default: false }),
    STORYBLOK_ACCESS_TOKEN: str(),
    DEBUG_LEVEL: str({
      default: '',
      choices: ['fatal', 'error', 'warn', 'info', 'debug', ''],
    }),

    DOMAIN_EN: str({ default: '' }),
    DOMAIN_DE_DE: str({ default: '' }),
    DOMAIN_DE_AT: str({ default: '' }),
    DOMAIN_DE_CH: str({ default: '' }),
    DOMAIN_DEFAULT: str({ default: '' }),
    DOMAIN_PER_LOCALE: bool({ default: true }),

    CHECKOUT_ACCESS_HEADER: str({ default: undefined }),

    CHECKOUT_HOST: str({ default: '' }),
    CHECKOUT_TOKEN_1001: str(),
    CHECKOUT_SECRET_1001: str(),

    GOOGLE_TAG_MANAGER_ID: str({ default: '' }),

    BASIC_AUTH: str({ default: '' }),
 
    CAMPAIGN_KEY_PREFIX: str(),

    HTTPS_KEY: str({ default: '' }),
    HTTPS_CERT: str({ default: '' }),

    ACTIVE_LPL_1001: bool({ default: false }),
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
