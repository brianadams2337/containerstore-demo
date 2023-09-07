/**
 * @param date
 * @returns Date formatted according to currentShop.locale
 */
const localeFormattedDate = (date: string | undefined): string | null => {
  const locale = useCurrentShop().value?.locale
  if (!date || isNaN(new Date(date).valueOf()) || !locale) {
    return null
  }

  return new Intl.DateTimeFormat(locale.replace('_', '-'), {
    dateStyle: 'medium',
  }).format(new Date(date))
}

export default { localeFormattedDate }
