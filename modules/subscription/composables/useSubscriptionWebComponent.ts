const isSubscriptionWebComponentLoaded = ref(false)

export default () => {
  const runtimeConfig = useRuntimeConfig()
  const { overviewWebHost, apiUrl } = runtimeConfig.public.subscription

  const log = useLog('useSubscriptionWebComponent')

  if (overviewWebHost?.length) {
    useHead({
      script: [
        {
          key: 'subscription-wc',
          defer: true,
          async: true,
          src: overviewWebHost,
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
