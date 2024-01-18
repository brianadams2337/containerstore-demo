export function useMobileSearch() {
  const isActive = ref(false)

  const setActive = (value: boolean) => {
    isActive.value = value
  }

  return {
    setActive,
    isActive: readonly(isActive),
  }
}
