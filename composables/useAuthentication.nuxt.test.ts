import { toRef, defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Gender } from '@scayle/storefront-nuxt'
import { FetchError } from 'ofetch'
import { userFactory } from '@scayle/storefront-nuxt/test/factories'
import { useAuthentication } from './useAuthentication'
import type { AuthTrackingEvent } from '~/types/tracking'

const {
  useSession,
  useTrackingEvents,
  useUser,
  route,
  useToast,
  useRouteHelpers,
  useLog,
} = vi.hoisted(() => ({
  route: { query: { redirectUrl: '' } },
  useRouteHelpers: vi.fn().mockReturnValue({ localizedNavigateTo: vi.fn() }),
  useSession: vi.fn(),
  useUser: vi.fn(),
  useWishlist: vi.fn(),
  useBasket: vi.fn(),
  useToast: vi.fn().mockReturnValue({ show: vi.fn() }),
  useLog: vi.fn().mockReturnValue({ error: vi.fn() }),
  useTrackingEvents: vi.fn().mockReturnValue({
    trackAuthenticated: vi.fn(),
    trackLogout: vi.fn(),
  }),
}))

vi.mock('#app/composables/router', () => ({
  useRoute: vi.fn().mockReturnValue(route),
}))

vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useLog,
    useUser,
    useSession,
  }
})

vi.mock('~/composables', () => ({
  useTrackingEvents,
  useToast,
  useRouteHelpers,
}))

/**
 * The `useauthentication` composable must be wrapped in a vue component because it relies on `useI18n` and includes lifecycle hooks.
 * The `useI18n` composable must be executed within a setup function. Additionally, when accessing reactive
 * data from `useauthentication` within the test component, avoid destructuring it, as this will lead to a loss of reactivity.
 */
const getTestComponent = (event: AuthTrackingEvent) => {
  return mount(
    defineComponent({
      template: '<div />',
      setup() {
        return useAuthentication(event)
      },
    }),
  )
}

describe('useAuthentication', () => {
  const loginWithIDPMock = vi.fn()
  const loginMock = vi.fn()
  const guestLoginMock = vi.fn()
  const forgotPasswordMock = vi.fn()
  const resetPasswordByHashMock = vi.fn()
  const logoutMock = vi.fn()
  const registerMock = vi.fn()

  useSession.mockReturnValue({
    login: loginMock,
    loginWithIDP: loginWithIDPMock,
    register: registerMock,
    guestLogin: guestLoginMock,
    forgetPassword: forgotPasswordMock,
    resetPasswordByHash: resetPasswordByHashMock,
    revokeToken: logoutMock,
  })

  describe('login', () => {
    const loginEvent = 'login'
    const customerType = 'existing'
    const loginPayload = {
      email: 'user@example.org',
      password: 'Test1234!' as string,
    }

    it('should show toast and track authenticated user on successful login', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })
      const { login } = getTestComponent(loginEvent).vm

      await login(loginPayload)

      expect(loginMock).toBeCalledWith(loginPayload)

      const { trackAuthenticated } = useTrackingEvents()

      expect(trackAuthenticated).toBeCalledWith(
        {
          event: loginEvent,
          method: 'email',
          status: 'successful',
          customer_id: 1,
          customer_type: customerType,
        },
        loginPayload.email,
      )

      expect(useToast().show).toBeCalledWith(
        'Anmeldung erfolgreich! Willkommen zurück!',
        { action: 'CONFIRM', type: 'SUCCESS' },
      )
    })

    it('should log in user and initiate redirect when query params are present', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })

      route.query = { redirectUrl: '/de/wishlist' }

      const { login } = getTestComponent(loginEvent).vm

      await login(loginPayload)

      expect(loginMock).toBeCalledWith(loginPayload)

      expect(useRouteHelpers().localizedNavigateTo).toBeCalledWith(
        route.query.redirectUrl,
      )
    })
    const httpErrorMessages = {
      400: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      401: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      403: 'Dieser Benutzer ist deaktiviert.',
      404: 'Deine E-Mail-Adresse oder dein Passwort ist falsch. Bitte versuche es erneut.',
      500: 'Die Anfrage führte zu einem Fehler',
    }

    it.each(Object.entries(httpErrorMessages))(
      'should handle %s error and clear it on unmount',
      async (statusCode, message) => {
        useUser.mockReturnValue({
          refresh: vi.fn(),
          customerType: toRef(customerType),
          user: toRef(undefined),
        })
        const error = new FetchError('Fetch Error')
        Object.assign(error, { response: { status: statusCode } })

        const component = getTestComponent(loginEvent)

        const { login } = component.vm

        loginMock.mockRejectedValue(error)

        await login(loginPayload)

        expect(loginMock).toBeCalledWith(loginPayload)

        const { trackAuthenticated } = useTrackingEvents()

        expect(trackAuthenticated).toBeCalledWith(
          {
            event: loginEvent,
            method: 'email',
            status: 'error',
          },
          loginPayload.email,
        )

        expect(component.vm.errorMessage).toEqual(message)

        component.unmount()
        expect(component.vm.errorMessage).toBeNull()
      },
    )
  })

  describe('loginIDP', () => {
    const loginEvent = 'login'
    const customerType = 'existing'
    const code =
      'def502003cc110812f24bf8934d832f4ee855ae1c72275aef5a2b4ec22b3fab8e1e261e982cc0dc359d5de723665ac810a8b03cd899d32668a559643203f3a85bac4dcdb7bdf96e3f0974011fb2699ce2d7b990698cefacff20d8c303960c1936060174c3d2bd7c218043eb0d60c38e36fadd14eada58ff3293ff235b138a8b758aeec307b5fe78ac3839cc1f082c8d23d13526a31f2a8810f94384f1259c9695db4663fd5291a6732d1c07b1eb5f30427215481234bef7a12843bf25f61f9c00651211cc14d06d78b55eb05181501fb7f3f0221eb9c1f930f148aa401e5ad33f7fe8511ab4fffdefc42bfe6cefe9b5351fe5e9a843bfff7fedfa42c9898895fab966a6d529973cb5f221c58f57c041fe4159386db45949590d01d797c6ac0b652b58b&state=eyJpZHBLZXkiOiJnb29nbGUiLCJjYWxsYmFja1VybCI6Imh0dHBzOlwvXC9sb2NhbGhvc3Q6MzAwMFwvZW5cL3NpZ25pblwvY2FsbGJhY2s/cmVkaXJlY3RVcmw9JTJGZGUiLCJjbGllbnRJZCI6IjIiLCJpYXQiOjE3Mzk2NDcyMjAsImV4cCI6MTczOTY1NDQyMH0='

    it('should show toast and track authenticated user on successful IDP login', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@gmail.com' })),
      })
      const { loginIDP } = getTestComponent(loginEvent).vm

      await loginIDP(code)

      expect(loginWithIDPMock).toBeCalledWith({ code })

      const { trackAuthenticated } = useTrackingEvents()

      expect(trackAuthenticated).toBeCalledWith(
        {
          event: loginEvent,
          method: 'email',
          status: 'successful',
          customer_id: 1,
          customer_type: customerType,
        },
        'user@gmail.com',
      )
    })

    it('should log in user with IDP and initiate redirect when query params are present', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@gmail.com' })),
      })

      route.query = { redirectUrl: '/de/basket' }

      const { loginIDP } = getTestComponent(loginEvent).vm

      await loginIDP(code)

      expect(loginWithIDPMock).toBeCalledWith({ code })

      expect(useRouteHelpers().localizedNavigateTo).toBeCalledWith(
        route.query.redirectUrl,
      )
      expect(useToast().show).toBeCalledWith(
        'Anmeldung erfolgreich! Willkommen zurück!',
        { action: 'CONFIRM', type: 'SUCCESS' },
      )
    })
  })

  describe('guestLogin', () => {
    const guestEvent = 'guest_login'
    const customerType = 'guest'
    const guestPayload = {
      email: 'user@example.org',
      first_name: 'John',
      last_name: 'Neil',
      gender: 'm' as Gender,
    }

    it('should show toast and track authenticated user on successful guest login', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })
      const { guestLogin } = getTestComponent(guestEvent).vm

      await guestLogin(guestPayload)

      expect(guestLoginMock).toBeCalledWith(guestPayload)

      const { trackAuthenticated } = useTrackingEvents()

      expect(trackAuthenticated).toBeCalledWith(
        {
          event: guestEvent,
          method: 'email',
          status: 'successful',
          customer_id: 1,
          customer_type: customerType,
        },
        guestPayload.email,
      )

      expect(useToast().show).toBeCalledWith(
        'Dein Konto wurde erstellt! Du kannst jetzt mit deiner Bestellung fortfahren.',
        { action: 'CONFIRM', type: 'SUCCESS' },
      )
    })

    it('should log in user and initiate redirect when query params are present', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: 'existing',
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })

      route.query = { redirectUrl: '/de/wishlist' }

      const { guestLogin } = getTestComponent(guestEvent).vm

      await guestLogin(guestPayload)

      expect(guestLoginMock).toBeCalledWith(guestPayload)

      expect(useRouteHelpers().localizedNavigateTo).toBeCalledWith(
        route.query.redirectUrl,
      )
    })

    const httpErrorMessages = {
      400: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      401: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      409: 'Dies ist ein registriertes Konto. Bitte verwende das richtige Passwort, um dich anzumelden.',
      500: 'Die Anfrage führte zu einem Fehler',
    }

    it.each(Object.entries(httpErrorMessages))(
      'should handle %s error and clear it on unmount',
      async (statusCode, message) => {
        useUser.mockReturnValue({
          refresh: vi.fn(),
          user: toRef(undefined),
        })
        const error = new FetchError('Fetch Error')
        Object.assign(error, { response: { status: statusCode } })

        const component = getTestComponent(guestEvent)

        const { guestLogin } = getTestComponent(guestEvent).vm

        guestLoginMock.mockRejectedValue(error)

        await guestLogin(guestPayload)

        expect(guestLoginMock).toBeCalledWith(guestPayload)

        const { trackAuthenticated } = useTrackingEvents()

        expect(trackAuthenticated).toBeCalledWith(
          {
            event: guestEvent,
            method: 'email',
            status: 'error',
          },
          guestPayload.email,
        )

        expect(component.vm.errorMessage).toEqual(message)

        component.unmount()
        expect(component.vm.errorMessage).toBeNull()
      },
    )
  })

  describe('register', () => {
    const registerEvent = 'sign_up'
    const customerType = 'new'
    const registerPayload = {
      email: 'user@example.org',
      first_name: 'John',
      last_name: 'Neil',
      gender: 'm' as Gender,
      password: 'Test1234!' as string,
    }

    it('should show toast and track authenticated user on successful registration', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })
      const { register } = getTestComponent(registerEvent).vm

      await register(registerPayload)

      expect(registerMock).toBeCalledWith(registerPayload)

      const { trackAuthenticated } = useTrackingEvents()

      expect(trackAuthenticated).toBeCalledWith(
        {
          event: registerEvent,
          method: 'email',
          status: 'successful',
          customer_id: 1,
          customer_type: customerType,
        },
        registerPayload.email,
      )

      expect(useToast().show).toBeCalledWith(
        'Dein Konto wurde erfolgreich erstellt!',
        { action: 'CONFIRM', type: 'SUCCESS' },
      )
    })

    it('should register user and initiate redirect when query params are present', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: 'new',
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })

      route.query = { redirectUrl: '/de/wishlist' }

      const { register } = getTestComponent(registerEvent).vm

      await register(registerPayload)

      expect(registerMock).toBeCalledWith(registerPayload)

      expect(useRouteHelpers().localizedNavigateTo).toBeCalledWith(
        route.query.redirectUrl,
      )
    })

    const httpErrorMessages = {
      400: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      401: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',

      409: 'Dieser Account existiert bereits.',
      422: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      500: 'Die Anfrage führte zu einem Fehler',
    }

    it.each(Object.entries(httpErrorMessages))(
      'should handle %s error and clear it on unmount',
      async (statusCode, message) => {
        useUser.mockReturnValue({
          refresh: vi.fn(),
          user: toRef(undefined),
        })
        const error = new FetchError('Fetch Error')
        Object.assign(error, { response: { status: statusCode } })

        const component = getTestComponent(registerEvent)

        const { register } = getTestComponent(registerEvent).vm

        registerMock.mockRejectedValue(error)

        await register(registerPayload)

        expect(registerMock).toBeCalledWith(registerPayload)

        const { trackAuthenticated } = useTrackingEvents()

        expect(trackAuthenticated).toBeCalledWith(
          {
            event: registerEvent,
            method: 'email',
            status: 'error',
          },
          registerPayload.email,
        )

        expect(component.vm.errorMessage).toEqual(message)

        component.unmount()
        expect(component.vm.errorMessage).toBeNull()
      },
    )
  })

  describe('forgotPassword', () => {
    const forgotPasswordEvent = 'forgot_password'
    it('should successfully initiate forgot password flow', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: undefined,
        user: undefined,
      })
      const { forgotPassword } = getTestComponent(forgotPasswordEvent).vm

      const response = await forgotPassword('user@example.org')

      expect(forgotPasswordMock).toBeCalledWith({ email: 'user@example.org' })

      expect(useToast().show).toBeCalledWith(
        'Ein Link zum Zurücksetzen des Passworts wurde an deine E-Mail gesendet.',
        { action: 'CONFIRM', type: 'INFO' },
      )

      expect(response).toEqual(true)
    })

    const httpErrorMessages = {
      400: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      401: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',

      403: 'Dieser Benutzer ist deaktiviert.',
      406: 'Der Token wurde bereits verwendet oder ist abgelaufen. Bitte fordere eine neue E-Mail zum Zurücksetzen des Passworts an.',
      409: 'Dieser Account existiert bereits.',
      422: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      500: 'Die Anfrage führte zu einem Fehler',
    }

    it.each(Object.entries(httpErrorMessages))(
      'should handle %s error and clear it on unmount',
      async (statusCode, message) => {
        useUser.mockReturnValue({
          refresh: vi.fn(),
          user: undefined,
        })
        const error = new FetchError('Fetch Error')
        Object.assign(error, { response: { status: statusCode } })

        const component = getTestComponent(forgotPasswordEvent)

        const { forgotPassword } = getTestComponent(forgotPasswordEvent).vm

        forgotPasswordMock.mockRejectedValue(error)

        const response = await forgotPassword('user@example.org')

        expect(forgotPasswordMock).toBeCalledWith({ email: 'user@example.org' })

        expect(component.vm.errorMessage).toEqual(message)

        component.unmount()
        expect(component.vm.errorMessage).toBeNull()

        expect(response).toEqual(false)
      },
    )
  })

  describe('resetPasswordByHash', () => {
    const resetPasswordEvent = 'reset_password'
    const resetPasswordPayload = {
      hash: '55c3818fbd3d162afff6425118a55099bbf6e8f7c8923fb791e32598abb5cd55',
      password: 'Test1234!' as string,
    }
    const customerType = 'existing'

    it('should successfully initiate reset password by hash flow', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })
      const { resetPasswordByHash } = getTestComponent(resetPasswordEvent).vm

      await resetPasswordByHash(resetPasswordPayload)

      expect(resetPasswordByHashMock).toBeCalledWith(resetPasswordPayload)

      const { trackAuthenticated } = useTrackingEvents()

      expect(trackAuthenticated).toBeCalledWith(
        {
          event: resetPasswordEvent,
          method: 'email',
          status: 'successful',
          customer_id: 1,
          customer_type: 'existing',
        },
        'user@example.org',
      )

      expect(useToast().show).toBeCalledWith(
        'Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt mit deinem neuen Passwort anmelden.',
        { action: 'CONFIRM', type: 'SUCCESS' },
      )
    })

    it('should reset user password and initiate redirect when query params are present', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })

      route.query = { redirectUrl: '/de/wishlist' }

      const { resetPasswordByHash } = getTestComponent(resetPasswordEvent).vm

      await resetPasswordByHash(resetPasswordPayload)

      expect(resetPasswordByHashMock).toBeCalledWith(resetPasswordPayload)

      expect(useRouteHelpers().localizedNavigateTo).toBeCalledWith(
        route.query.redirectUrl,
      )
    })

    const httpErrorMessages = {
      400: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      401: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      500: 'Die Anfrage führte zu einem Fehler',
    }

    it.each(Object.entries(httpErrorMessages))(
      'should handle %s error and clear it on unmount',
      async (statusCode, message) => {
        useUser.mockReturnValue({
          refresh: vi.fn(),
          customerType: toRef(customerType),
          user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
        })
        const error = new FetchError('Fetch Error')
        Object.assign(error, { response: { status: statusCode } })

        const component = getTestComponent(resetPasswordEvent)

        const { resetPasswordByHash } = getTestComponent(resetPasswordEvent).vm

        resetPasswordByHashMock.mockRejectedValue(error)

        await resetPasswordByHash(resetPasswordPayload)

        expect(resetPasswordByHashMock).toBeCalledWith(resetPasswordPayload)

        expect(component.vm.errorMessage).toEqual(message)

        component.unmount()
        expect(component.vm.errorMessage).toBeNull()
      },
    )
  })

  describe('logout', () => {
    const logoutEvent = 'logout'
    const customerType = 'existing'

    it('should successfully initiate reset password by hash flow', async () => {
      useUser.mockReturnValue({
        refresh: vi.fn(),
        customerType: toRef(customerType),
        user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
      })
      const { logout } = getTestComponent(logoutEvent).vm

      await logout()

      expect(logoutMock).toBeCalled()

      const { trackLogout } = useTrackingEvents()

      expect(trackLogout).toBeCalled()

      expect(useRouteHelpers().localizedNavigateTo).toBeCalledWith('/')
    })

    const httpErrorMessages = {
      400: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
      422: 'Die Anfrage konnte nicht bearbeitet werden, bitte versuche es erneut.',
    }

    it.each(Object.entries(httpErrorMessages))(
      'should handle %s error and clear it on unmount',
      async (statusCode, message) => {
        useUser.mockReturnValue({
          refresh: vi.fn(),
          customerType: toRef(customerType),
          user: toRef(userFactory.build({ id: 1, email: 'user@example.org' })),
        })
        const error = new FetchError('Fetch Error')
        Object.assign(error, { response: { status: statusCode } })

        const component = getTestComponent(logoutEvent)

        const { logout } = component.vm

        logoutMock.mockRejectedValue(error)

        await logout()

        expect(logoutMock).toBeCalled()

        expect(component.vm.errorMessage).toEqual(message)

        component.unmount()
        expect(component.vm.errorMessage).toBeNull()
      },
    )
  })
})
