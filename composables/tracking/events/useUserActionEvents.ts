import type { ShopUser } from '@scayle/storefront-nuxt'

export type AuthTrackingEventData = {
  customer_id?: number
  customer_type?: CustomerType
  eh?: string
  event: AuthTrackingEvent
  method?: AuthenticationType
  status?: 'successful' | 'error'
}

const METHOD_DEFAULT = 'none'

const useUserActionEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => {
  const route = useRoute()

  return {
    trackLogout: () => {
      track('logout', {
        customer_id: undefined,
        eh: undefined,
        content_name: route.fullPath,
      })
    },

    trackAuthenticated: async (payload: AuthTrackingEventData, email = '') => {
      const eh = payload.eh || (email && (await getEmailHash(email)))
      const {
        customer_id: customerId,
        method,
        status,
        customer_type: customerType = 'new',
      } = payload

      const isLoginEvent = payload.event === 'login'
      const methodKeyName = isLoginEvent ? 'login_method' : 'method'

      track(
        payload.event || 'login',
        mapCustomerInfoToTrackingPayload({
          customer_id: customerId,
          [methodKeyName]: method || METHOD_DEFAULT,
          eh,
          customer_type: customerType, // TODO: CO should add this to payload as well
          status,
          content_name: route.fullPath,
        }),
      )
    },

    trackRegister: async (
      payload: AuthTrackingEventData,
      user?: ShopUser | null,
    ) => {
      const { customer_id: customerId, method, status } = payload
      const eh = await getEmailHash(user?.email)
      track(
        'sign_up',
        mapCustomerInfoToTrackingPayload({
          customer_id: customerId,
          method: method || METHOD_DEFAULT,
          eh,
          status,
          content_name: route.fullPath,
        }),
      )
    },
  }
}

export default useUserActionEvents
