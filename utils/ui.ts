import { Size } from '#imports'

export const showDividerTag = (index: number, arrayLength: number) => {
  return index >= 0 && arrayLength > 1 && index < arrayLength - 1
}

export const sizeUtils = (currentSize: Size = Size.MD) => {
  const isSize = (size?: Size): boolean => size === currentSize

  return {
    isSize,
  }
}
