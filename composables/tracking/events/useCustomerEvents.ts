import { getEmailHash } from '~/utils'
import type {
  TrackingEvent,
  TrackingPayload,
  TrackCustomerDataParams,
  AuthenticationType,
} from '~/types/tracking'

const useCustomerEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => ({
  trackCustomerData: async (params: TrackCustomerDataParams) =>
    track('customer_data', {
      customer_id: params.isLoggedIn ? params.user?.id : undefined,
      customer_type: params.customerType,
      login: params.isLoggedIn,
      method: params.isLoggedIn
        ? (params.user?.authentication?.type as AuthenticationType)
        : 'none',
      eh: params.isLoggedIn ? await getEmailHash(params.user?.email || '') : '',
    }),
})

export default useCustomerEvents
