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

    CHECKOUT_HOST: str({ default: '' }),
    CHECKOUT_TOKEN_1001: str(),
    CHECKOUT_SECRET_1001: str(),
    CHECKOUT_USER_1001: str(),
    CHECKOUT_ACCESS_HEADER: str({ default: undefined }),

    BASIC_AUTH: str({ default: '' }),

    CAMPAIGN_KEY_PREFIX: str(),

    HTTPS_KEY: str({ default: '' }),
    HTTPS_CERT: str({ default: '' }),

    STORYBLOK_ACCESS_TOKEN: str(),
    STORYBLOK_WEBHOOK_SECRET: str({
      default: 'hereupon-caviar-nicety-wanton',
    }),
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
