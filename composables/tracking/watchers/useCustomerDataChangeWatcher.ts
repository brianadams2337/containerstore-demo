export const useCustomerDataChangeWatcher = async () => {
  const { isLoggedIn, customerType, user } = await useUser()

  const { trackCustomerData } = useTrackingEvents()

  watch(
    () => user.value,
    (userData) => {
      trackCustomerData({
        isLoggedIn: isLoggedIn.value,
        customerType: customerType.value,
        user: userData,
      })
    },
  )

  onNuxtReady(() => {
    if (isLoggedIn.value) {
      return
    }

    trackCustomerData({
      isLoggedIn: false,
      customerType: 'guest',
    })
  })
}
