const isSubscriptionWebComponentLoaded = ref(false)

export default () => {
  const runtimeConfig = useRuntimeConfig()
  const { webHost, apiUrl } = runtimeConfig.public.subscription

  const log = useLog('useSubscriptionWebComponent')

  if (webHost?.length) {
    useHead({
      script: [
        {
          key: 'subscription-wc',
          defer: true,
          async: true,
          src: webHost,
          onload() {
            isSubscriptionWebComponentLoaded.value = true
          },
        },
      ],
    })
  } else {
    log.error(
      'Cannot load subscription web component, host is not configured as environment variable.',
    )
  }

  return { isSubscriptionWebComponentLoaded, apiUrl }
}
