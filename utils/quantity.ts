export const getQuantitySelectionList = (quantity = 0, excludeZero = false) => {
  const length = Math.max(Math.min(quantity, 9), 0)

  const quantityList = Array.from({ length }, (_, index) => index)

  const [_zero, ...quantityListWithoutZero] = quantityList

  return excludeZero ? quantityListWithoutZero : quantityList
}
