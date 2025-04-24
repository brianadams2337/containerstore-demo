import { useI18n } from '#i18n'
import { useCurrentShop } from '#storefront/composables'

/**
 * Get the first day of the week for the current locale
 */
export const useFirstDayOfWeek = function () {
  const currentShop = useCurrentShop()
  const i18n = useI18n()
  const locale = new Intl.Locale(currentShop.value.locale)
  return 'getWeekInfo' in locale && typeof locale.getWeekInfo === 'function'
    ? locale.getWeekInfo().firstDay
    : parseInt(i18n.t('intl.first_day')) ?? 1
}
