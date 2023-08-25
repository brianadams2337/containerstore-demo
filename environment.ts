import { bool, cleanEnv, defaultReporter, host, str, url } from 'envalid'
import yn from 'yn'

export default cleanEnv(
  process.env,
  {
    BASE_URL: url(),
    REDIS_HOST: host({ default: 'localhost' }),

    BAPI_HOST: url(),
    BAPI_TOKEN: str(),

    AY_CACHE_DISABLED: bool({ default: false }),

    DOMAIN_DEFAULT: str({ default: '' }),

    CHECKOUT_USER_1001: str(),
    CHECKOUT_TOKEN_1001: str(),
    CHECKOUT_SECRET_1001: str(),
    CHECKOUT_HOST: str({ default: '' }),

    GTM_ID: str({ default: '' }),

    BASIC_AUTH: str({ default: '' }),

    CAMPAIGN_KEY_PREFIX: str(),
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
