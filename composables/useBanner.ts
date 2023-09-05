export default () => {
  const isOpen = ref<boolean>(true)
  const localKey = 'bannerLastCloseAt'
  const shouldBeVisible = (lastUpdatedAt: string): boolean => {
    if (process.server) {
      return false
    }

    const lastClosedAt = localStorage.getItem(localKey)
    if (lastUpdatedAt && lastClosedAt) {
      return Date.parse(lastUpdatedAt) > parseInt(lastClosedAt)
    }
    return true
  }
  const close = () => {
    const currentTime = Date.parse(new Date().toString())
    localStorage.setItem(localKey, currentTime.toString())
    isOpen.value = false
  }

  return {
    close,
    isOpen,
    shouldBeVisible,
  }
}
