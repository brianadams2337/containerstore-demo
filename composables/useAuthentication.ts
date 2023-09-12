import {
  GuestRequest,
  LoginRequest,
  RegisterRequest,
  SendResetPasswordEmailRequest,
  UpdatePasswordByHashRequest,
} from '@scayle/storefront-nuxt'
import { FetchError } from 'ofetch'
import { Action } from '~/constants'

const httpErrorMessages: Record<number, string> = {
  400: '400_bad_request',
  401: '401_unauthorized',
  403: '403_user_deactivated',
  404: '404_not_found',
  406: '406_hash_has_expired',
  409: '409_already_exists',
  500: '500_server_error',
} as const

export type AuthEvent =
  | 'login'
  | 'logout'
  | 'sign_up'
  | 'forget_password'
  | 'reset_password'
  | 'guest_login'

export const useAuthentication = async (
  event: AuthEvent,
  // method: AuthenticationType = 'email',
) => {
  const { $alert, $i18n } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()

  const { auth: authConfig } = useRuntimeConfig().public

  // const { trackAuthenticated, trackLogout } = useTrackingEvents()

  const { user, fetch: refreshUser } = await useUser({ autoFetch: false })
  const { fetch: refreshWishlist } = await useWishlist()
  const { fetch: refreshBasket } = await useBasket()

  const refresh = async () => {
    await Promise.all([refreshUser(), refreshWishlist(), refreshBasket()])
  }

  const session = useSession()

  const log = useLog('useAuthentication')

  const isSubmitting = ref(false)

  const successMessage = computed(() =>
    $i18n.t(`login_page.${event}.status.success`),
  )

  const login = async (data: LoginRequest) => {
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

  const guestLogin = async (data: GuestRequest) => {
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

  const register = async (data: RegisterRequest) => {
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

  const forgotPassword = async (data: SendResetPasswordEmailRequest) => {
    let hasSuccess = true

    isSubmitting.value = true

    try {
      await session.forgetPassword(data)
      $alert.show(successMessage.value, Action.CONFIRM)
    } catch (error) {
      handleError(error)
      hasSuccess = false
    }
    isSubmitting.value = false

    return hasSuccess
  }

  const resetPasswordByHash = async (data: UpdatePasswordByHashRequest) => {
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
        // trackLogout(user.value.id, user.value.email)
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
      // trackAuthenticated(
      //   {
      //     event,
      //     method,
      //     status: 'successful',
      //     customer_id: user.value.id,
      //     customer_type: customerType.value,
      //   },
      //   user.value.email,
      // )

      const isSigninPath = route.path === toLocalePath(routeList.signin.path)
      const homePath = authConfig?.redirect.home || routeList.home.path
      const redirectTo = isSigninPath ? homePath : route.fullPath

      await redirectUser(redirectTo)
    }

    $alert.show(successMessage.value, Action.CONFIRM)
  }

  const trackFailedAuthentication = (_email: string) => {
    // trackAuthenticated(
    //   {
    //     event,
    //     method,
    //     status: 'error',
    //   },
    //   email,
    // )
  }

  const handleError = (error: unknown) => {
    if (error instanceof FetchError) {
      const status = error.response?.status
      if (status && Object.hasOwn(httpErrorMessages, status)) {
        const errorMessage = $i18n.t(
          `login_page.${event}.status.error.${httpErrorMessages[status]}`,
        )
        $alert.show(errorMessage, Action.CONFIRM)
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
      : await router.push(toLocalePath(redirectTo))
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
