import { FetchError } from 'ofetch'
import type { Composer } from '#i18n'
import type { AuthTrackingEvent } from '~~/types/tracking'

const getGenericErrorMessage = (status: number, i18n: Composer): string => {
  switch (status) {
    case 400:
      return i18n.t('authentication.notification.error.generic.400')
    case 401:
      return i18n.t('authentication.notification.error.generic.401')
    case 403:
      return i18n.t('authentication.notification.error.generic.403')
    case 404:
      return i18n.t('authentication.notification.error.generic.404')
    case 406:
      return i18n.t('authentication.notification.error.generic.406')
    case 409:
      return i18n.t('authentication.notification.error.generic.409')
    case 422:
      return i18n.t('authentication.notification.error.generic.422')
    case 500:
      return i18n.t('authentication.notification.error.generic.500')
    default:
      return i18n.t('authentication.notification.error.generic.500')
  }
}

export const resolveErrorMessage = (
  error: unknown,
  event: AuthTrackingEvent,
  i18n: Composer,
): string => {
  if (error instanceof FetchError) {
    const status = error.response?.status
    if (status) {
      const authFlowSpecificPath = `authentication.notification.error.${event}.${status}`
      // Prioritize specific translations for certain flows (e.g., guest login error 409).
      // If a specific translation is not available, fall back to the general sign-in error message translations.
      return i18n.te(authFlowSpecificPath)
        ? i18n.t(authFlowSpecificPath)
        : getGenericErrorMessage(status, i18n)
    }
  }

  return i18n.t('authentication.notification.error.generic.500')
}
