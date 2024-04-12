import yn from 'yn'
import { purifySensitiveData } from '@scayle/storefront-nuxt'

/*
    This Nitro plugin logs the sanitized runtime configuration at startup.
    If enabled, the plugin extracts the runtime configuration, sanitizes it by redacting sensitive information and logs the result.
    This feature aids in development and debugging, ensuring sensitive data like tokens and passwords are not exposed in logs.
*/
export default defineNitroPlugin(() => {
  if (!yn(process.env.ENABLE_CONFIG_LOG_RUNTIME)) {
    return
  }

  const runtimeConfig = useRuntimeConfig()

  // Specify the keys from runtimeConfig that should be redacted in logs
  const sensitiveKeys = [
    'token',
    'password',
    'clientSecret',
    'apiToken',
    'secret',
  ]

  const loggableConfig: Record<string, any> = purifySensitiveData(
    runtimeConfig,
    sensitiveKeys,
  )

  const configToPrint = yn(process.env.ENABLE_CONFIG_LOG_PRETTIER)
    ? JSON.stringify(loggableConfig, null, 2)
    : JSON.stringify(loggableConfig)

  console.log(
    '[storefront-boilerplate] runtimeConfig after startup:',
    configToPrint,
  )
})
