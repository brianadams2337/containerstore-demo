export function useDefaultCMSOptions() {
  const currentShop = useCurrentShop()

  // TODO: Preview mode
  return {
    locale: currentShop.value.locale ?? '',
  } as const
}
