import type { Value } from '@scayle/storefront-nuxt'

export const hexToRGBAColor = (hex: string, alpha: number): string => {
  const hexValue = hex.replace('#', '')
  const r = parseInt(hexValue.substring(0, 2), 16)
  const g = parseInt(hexValue.substring(2, 4), 16)
  const b = parseInt(hexValue.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha / 100})`
}

export const formatColors = (colors: Value[] = []): string => {
  if (!colors.length) {
    return ''
  }
  const colorLabels = colors.map((color) => color.label)
  if (colorLabels.length === 1) {
    return colorLabels[0]
  }
  const lastColorLabel = colorLabels.at(-1)
  const restColorLabels = colorLabels.slice(0, -1)
  return `${restColorLabels.join(', ')} & ${lastColorLabel}`
}
