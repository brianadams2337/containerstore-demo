export const getQuantitySelectionList = (quantity = 0, excludeZero = false) => {
  const processedQuantity = Math.max(Math.min(quantity, 9), 0)

  const quantityList = Array.from({ length: processedQuantity }, (_, i) => i)

  if (excludeZero) {
    quantityList.shift()
  }

  return quantityList
}
