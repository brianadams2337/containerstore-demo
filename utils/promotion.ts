export const getBackgroundColorStyle = (color?: string) => {
  return { ...(!!color && { backgroundColor: String(color) }) }
}
