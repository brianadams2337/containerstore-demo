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
) => ({
  trackLogout: async (customerId: number, email = '') => {
    track('logout', {
      customer_id: customerId,
      eh: email ? await getEmailHash(email) : '',
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
    track(
      payload.event || 'login',
      mapCustomerInfoToTrackingPayload({
        customer_id: customerId,
        method: method || METHOD_DEFAULT,
        eh,
        customer_type: customerType, // TODO: CO should add this to payload as well
        status,
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
      }),
    )
  },
})

export default useUserActionEvents
