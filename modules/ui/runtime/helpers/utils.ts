import { Size } from './constants'

export const showDividerTag = (index: number, arrayLength: number): boolean => {
  return index >= 0 && arrayLength > 1 && index < arrayLength - 1
}

export const getSizeUtils = (currentSize: Size = Size.MD) => {
  const isSize = (size?: Size): boolean => size === currentSize

  return {
    isSize,
  }
}
