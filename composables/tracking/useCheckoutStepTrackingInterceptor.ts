const getPageType = (hash: string): PageType => {
  if (hash.endsWith('#/auth')) {
    return 'checkout:#/auth'
  }
  if (hash.endsWith('#/shipping')) {
    return 'checkout:#/shipping'
  }
  if (hash.endsWith('#/payment')) {
    return 'checkout:#/payment'
  }
  return 'checkout'
}

/** @function tracks changes if the current checkout step */
export const useCheckoutStepTrackingInterceptor = () => {
  const { trackContentView } = useTrackingEvents()

  let pushStateNative: typeof window.history.pushState
  let replaceStateNative: typeof window.history.replaceState

  let lastPageType: PageType | undefined

  onMounted(() => {
    pushStateNative = window.history.pushState
    replaceStateNative = window.history.replaceState

    const apply = (
      target: any,
      thisArg: Record<string, any>,
      argArray: any[],
    ) => {
      const clickOrigin = window.location.href.slice(
        window.location.origin.length,
      )

      target.apply(thisArg, argArray as [data: any, unused: string])

      const pageType = getPageType(argArray[argArray.length - 1])
      if (pageType !== lastPageType) {
        lastPageType = pageType
        trackContentView(
          window.location.pathname,
          document?.title || '',
          pageType,
          '',
          clickOrigin,
        )
      }
    }

    window.history.pushState = new Proxy(window.history.pushState, { apply })

    // Replace state occurs when the user is logged in so the checkout
    // url gets redirected to the next step
    window.history.replaceState = new Proxy(window.history.replaceState, {
      apply,
    })
  })

  onUnmounted(() => {
    // cleanup history methods
    window.history.pushState = pushStateNative
    window.history.replaceState = replaceStateNative
  })
}
