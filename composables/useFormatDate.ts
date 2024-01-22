export function useFormatDate() {
  const currentShop = useCurrentShop()

  const formatLocaleDate = (date?: string): string | null => {
    const locale = currentShop.value?.locale

    if (!date || isNaN(new Date(date).valueOf()) || !locale) {
      return null
    }

    return new Intl.DateTimeFormat(locale.replace('_', '-'), {
      dateStyle: 'medium',
    }).format(new Date(date))
  }

  return {
    formatLocaleDate,
  }
}
