import type {
  GuestRequest,
  LoginRequest,
  RegisterRequest,
  UpdatePasswordByHashRequest,
} from '@scayle/storefront-nuxt'
import { FetchError } from 'ofetch'
import { computed, ref, readonly } from 'vue'
import { useState } from 'nuxt/app'
import type { Ref } from 'vue'
import { clearNuxtData } from '#app/composables/asyncData'
import { useRouteHelpers, useToast, useTrackingEvents } from '~/composables'
import type { AuthTrackingEvent, AuthenticationType } from '~/types/tracking'
import { useNuxtApp } from '#app'
import { useRoute, useRouter } from '#app/composables/router'
import {
  useBasket,
  useLog,
  useSession,
  useUser,
  useWishlist,
} from '#storefront/composables'
import { routeList } from '~/utils'

export interface UseAuthenticationReturn {
  /** An async function that handles the authentication process for a regular user */
  login: (data: Omit<LoginRequest, 'shop_id'>) => Promise<void>
  /** An async function that handles the authentication process for a guest user */
  guestLogin: (data: Omit<GuestRequest, 'shop_id'>) => Promise<void>
  /** An async function that handles logging out the user */
  logout: () => Promise<void>
  /** An async function that handles registering the user */
  register: (data: Omit<RegisterRequest, 'shop_id'>) => Promise<void>
  /** An async function that handles the password recovery process for a specific user */
  forgotPassword: (email: string) => Promise<boolean>
  /** An async function that handles resetting the password using a hash */
  resetPasswordByHash: (
    data: Omit<UpdatePasswordByHashRequest, 'shop_id'>,
  ) => Promise<void>
  /** An async function that handles login through an identity provider (IDP) */
  loginIDP: (code: string) => Promise<void>
  /** A readonly reactive boolean that indicates whether each of the actions mentioned above is currently in the process of being submitted */
  isSubmitting: Readonly<Ref<boolean, boolean>>
  /** A readonly reactive string for storing the error message */
  errorMessage: Readonly<Ref<string | null, string | null>>
  /** An function that cleares the error message */
  clearErrorMessage: () => void
}

const httpErrorMessages: Record<number, string> = {
  400: '400_bad_request',
  401: '401_unauthorized',
  403: '403_user_deactivated',
  404: '404_not_found',
  406: '406_hash_has_expired',
  409: '409_already_exists',
  500: '500_server_error',
} as const

/**
 * A composable for authentication actions and data manipulation.
 * In addition of interacting with the authentication, it also takes care of tracking,
 * handling errors and displaying success toast messages.

 * @param event - Authentication event type
 * @param method - Authentication type method
 * @returns An {@link UseAuthenticationReturn} object containing reactive authentication data and functions.
 */
export function useAuthentication(
  event: AuthTrackingEvent,
  method: AuthenticationType = 'email',
): UseAuthenticationReturn {
  const { $i18n } = useNuxtApp()
  const route = useRoute()
  const router = useRouter()

  const errorMessage = useState<string | null>(event, () => null)

  const toast = useToast()

  const { trackAuthenticated, trackLogout } = useTrackingEvents()

  const session = useSession()
  const { localizedNavigateTo } = useRouteHelpers()
  const log = useLog('useAuthentication')

  const isSubmitting = ref(false)

  const successMessage = computed<string>(() => {
    return $i18n.t(`sign_in_page.${event}.status.success`)
  })

  const { refresh: refreshWishlist } = useWishlist()
  const { refresh: refreshBasket } = useBasket()
  const { user, refresh: refreshUser, customerType } = useUser()

  const refresh = async (): Promise<void> => {
    await Promise.all([refreshUser(), refreshWishlist(), refreshBasket()])
  }

  const login = async (data: Omit<LoginRequest, 'shop_id'>): Promise<void> => {
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

  const loginIDP = async (code: string): Promise<void> => {
    isSubmitting.value = true

    try {
      await session.loginWithIDP({ code })
      await authenticated()
    } catch (error) {
      handleError(error)
    }

    isSubmitting.value = false
  }

  const guestLogin = async (
    data: Omit<GuestRequest, 'shop_id'>,
  ): Promise<void> => {
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

  const register = async (
    data: Omit<RegisterRequest, 'shop_id'>,
  ): Promise<void> => {
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

  const forgotPassword = async (email: string): Promise<boolean> => {
    let hasSuccess = true

    isSubmitting.value = true

    try {
      await session.forgetPassword({ email })
      toast.show(successMessage.value, { action: 'CONFIRM' })
    } catch (error) {
      handleError(error)
      hasSuccess = false
    }
    isSubmitting.value = false

    return hasSuccess
  }

  const resetPasswordByHash = async (
    data: Omit<UpdatePasswordByHashRequest, 'shop_id'>,
  ): Promise<void> => {
    isSubmitting.value = true

    try {
      await session.resetPasswordByHash(data)
      await authenticated()
    } catch (error) {
      handleError(error)
    }

    isSubmitting.value = false
  }

  const logout = async (): Promise<void> => {
    isSubmitting.value = true

    try {
      await session.revokeToken()
      // we call `useUser` in templates/nuxt/middleware/authGuard.global.ts with the key `authGuard-user`.
      // We need to delete the user data for this key on logout to reset the state in the auth guard.
      // Without deleting the date, the auth guard would allow navigating to protected pages for logged out users.
      clearNuxtData('authGuard-user')
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
   * After a user was authenticated by login in, or registering.
   * Refresh user data, basket & wishlist.
   */
  const authenticated = async (): Promise<void> => {
    await refresh()

    if (!user.value) {
      return
    }

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

    if (route.query.redirectUrl) {
      await redirectUser(route.query.redirectUrl as string)
    } else {
      router.back()
    }

    toast.show(successMessage.value, { action: 'CONFIRM', type: 'SUCCESS' })
  }

  const trackFailedAuthentication = async (email: string): Promise<void> => {
    await trackAuthenticated(
      {
        event,
        method,
        status: 'error',
      },
      email,
    )
  }

  const handleError = (error: unknown): void => {
    if (error instanceof FetchError) {
      const status = error.response?.status
      if (status && Object.hasOwn(httpErrorMessages, status)) {
        errorMessage.value = $i18n.t(
          `sign_in_page.${event}.status.error.${httpErrorMessages[status]}`,
        )
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

  const clearErrorMessage = (): void => {
    errorMessage.value = null
  }

  return {
    login,
    guestLogin,
    logout,
    register,
    forgotPassword,
    resetPasswordByHash,
    loginIDP,
    clearErrorMessage,
    isSubmitting: readonly(isSubmitting),
    errorMessage: readonly(errorMessage),
  }
}
