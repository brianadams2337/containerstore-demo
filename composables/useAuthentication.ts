import type {
  GuestRequest,
  LoginRequest,
  RegisterRequest,
  UpdatePasswordByHashRequest,
} from '@scayle/storefront-nuxt'
import { FetchError } from 'ofetch'

const httpErrorMessages: Record<number, string> = {
  400: '400_bad_request',
  401: '401_unauthorized',
  403: '403_user_deactivated',
  404: '404_not_found',
  406: '406_hash_has_expired',
  409: '409_already_exists',
  500: '500_server_error',
} as const

export async function useAuthentication(
  event: AuthTrackingEvent,
  method: AuthenticationType = 'email',
) {
  const { $i18n } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()

  const toast = useToast()

  const { trackAuthenticated, trackLogout } = useTrackingEvents()

  const session = useSession()
  const localePath = useLocalePath()
  const { localizedNavigateTo } = useRouteHelpers()
  const log = useLog('useAuthentication')

  const isSubmitting = ref(false)

  const successMessage = computed(() =>
    $i18n.t(`login_page.${event}.status.success`),
  )

  const [
    { fetch: refreshWishlist },
    { fetch: refreshBasket },
    { user, fetch: refreshUser, customerType },
  ] = await Promise.all([useWishlist(), useBasket(), useUser()])

  const refresh = async () => {
    await Promise.all([refreshUser(), refreshWishlist(), refreshBasket()])
  }

  const login = async (data: Omit<LoginRequest, 'shop_id'>) => {
    isSubmitting.value = true

    try {
      await session.login(data)
      await authenticated()
    } catch (error) {
      trackFailedAuthentication(data.email)
      handleError(error)
    }

    isSubmitting.value = false
  }

  const loginIDP = async (code: string) => {
    isSubmitting.value = true

    try {
      await session.loginWithIDP({ code })
      await authenticated()
    } catch (error) {
      handleError(error)
    }

    isSubmitting.value = false
  }

  const guestLogin = async (data: Omit<GuestRequest, 'shop_id'>) => {
    isSubmitting.value = true

    try {
      await session.guestLogin(data)
      await authenticated()
    } catch (error) {
      trackFailedAuthentication(data.email)
      handleError(error)
    }

    isSubmitting.value = false
  }

  const register = async (data: Omit<RegisterRequest, 'shop_id'>) => {
    isSubmitting.value = true

    try {
      await session.register(data)
      await authenticated()
    } catch (error) {
      trackFailedAuthentication(data.email)
      handleError(error)
    }

    isSubmitting.value = false
  }

  const forgotPassword = async (email: string) => {
    let hasSuccess = true

    isSubmitting.value = true

    try {
      await session.forgetPassword({ email })
      toast.show(successMessage.value, 'CONFIRM')
    } catch (error) {
      handleError(error)
      hasSuccess = false
    }
    isSubmitting.value = false

    return hasSuccess
  }

  const resetPasswordByHash = async (
    data: Omit<UpdatePasswordByHashRequest, 'shop_id'>,
  ) => {
    isSubmitting.value = true

    try {
      await session.resetPasswordByHash(data)
      await authenticated()
    } catch (error) {
      handleError(error)
    }

    isSubmitting.value = false
  }

  const logout = async () => {
    isSubmitting.value = true

    try {
      await session.revokeToken()
      if (user.value) {
        trackLogout()
      }
    } catch (error) {
      handleError(error)
    }

    await refresh()

    isSubmitting.value = false

    redirectUser(routeList.home.path)
  }

  /**
   * After a user was authenticated by loggin in, or registering.
   * Refresh user data, basket & wishlist.
   */
  const authenticated = async () => {
    await refresh()

    if (user.value) {
      await trackAuthenticated(
        {
          event,
          method,
          status: 'successful',
          customer_id: user.value.id,
          customer_type: customerType.value,
        },
        user.value.email,
      )

      let redirectTo = localePath(routeList.home.path)

      if (route.query.redirectUrl) {
        redirectTo = route.query.redirectUrl as string
      }

      await redirectUser(redirectTo)
    }

    toast.show(successMessage.value, 'CONFIRM')
  }

  const trackFailedAuthentication = async (email: string) => {
    await trackAuthenticated(
      {
        event,
        method,
        status: 'error',
      },
      email,
    )
  }

  const handleError = (error: unknown) => {
    if (error instanceof FetchError) {
      const status = error.response?.status
      if (status && Object.hasOwn(httpErrorMessages, status)) {
        const errorMessage = $i18n.t(
          `login_page.${event}.status.error.${httpErrorMessages[status]}`,
        )
        toast.show(errorMessage, 'CONFIRM')
      }
    }
    // remove user data (email, password) from the error object, before logging it

    // @ts-expect-error Property 'config' does not exist on type '{}'.ts(2339)
    delete error?.config?.data

    log.error(`Error while ${event} was called.`, {
      error,
    })
  }

  const redirectUser = async (redirectTo: string) => {
    return router.currentRoute.value.fullPath === redirectTo
      ? window.location.reload()
      : await localizedNavigateTo(redirectTo)
  }

  return {
    login,
    guestLogin,
    logout,
    register,
    forgotPassword,
    resetPasswordByHash,
    isSubmitting,
    loginIDP,
  }
}
