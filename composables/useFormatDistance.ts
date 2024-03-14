export const useFormatDistance = () => {
  const currentShop = useCurrentShop()
  const formatter = new Intl.NumberFormat(currentShop.value.locale, {
    maximumSignificantDigits: 3,
  })
  return (distance: number): string => {
    return distance < 2000
      ? distance + ' m'
      : formatter.format(distance / 1000) + ' km'
  }
}
