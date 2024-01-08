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

export const useAuthentication = async (
  event: AuthTrackingEvent,
  method: AuthenticationType = 'email',
) => {
  const { $alert, $i18n } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()

  const { auth: authConfig } = useRuntimeConfig().public

  const { trackAuthenticated, trackLogout } = useTrackingEvents()

  const { user, fetch: refreshUser, customerType } = await useUser()
  const { fetch: refreshWishlist } = await useWishlist()
  const { fetch: refreshBasket } = await useBasket()

  const refresh = async () => {
    await Promise.all([refreshUser(), refreshWishlist(), refreshBasket()])
  }

  const session = useSession()
  const localePath = useLocalePath()
  const { localizedNavigateTo } = useRouteHelpers()
  const log = useLog('useAuthentication')

  const isSubmitting = ref(false)

  const successMessage = computed(() =>
    $i18n.t(`login_page.${event}.status.success`),
  )

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
      $alert.show(successMessage.value, 'CONFIRM')
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
        await trackLogout(user.value.id, user.value.email)
      }
    } catch (error) {
      handleError(error)
    }

    await refresh()

    isSubmitting.value = false

    const logoutRedirect = authConfig?.redirect.logout || routeList.home.path
    redirectUser(logoutRedirect)
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

      const isSignInPathWithoutRedirect =
        route.fullPath === localePath(routeList.signin.path)
      const homePath = authConfig?.redirect.home || routeList.home.path

      let redirectTo = route.path
      if (isSignInPathWithoutRedirect) {
        redirectTo = homePath
      }
      if (route.query.redirectUrl) {
        redirectTo = route.query.redirectUrl as string
      }

      await redirectUser(redirectTo)
    }

    $alert.show(successMessage.value, 'CONFIRM')
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
        $alert.show(errorMessage, 'CONFIRM')
      }
    }
    // remove user data (email, password) from the error object, before logging it

    // @ts-ignore
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
  }
}
