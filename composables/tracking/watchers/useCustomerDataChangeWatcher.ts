export const useCustomerDataChangeWatcher = async () => {
  const { isLoggedIn, customerType, user, fetching } = await useUser()

  const { trackCustomerData } = useTrackingEvents()

  watch(
    () => user.value,
    (userData) => {
      if (!isLoggedIn.value) {
        return
      }
      trackCustomerData({
        isLoggedIn: isLoggedIn.value,
        customerType: customerType.value,
        user: userData,
      })
    },
  )

  // TODO: This is just a workaround. On Latest and Test user is not fetched yet. So long term solution will be initializing user data much earlier.
  // Remove the watcher and test this again after another solution is implemented.
  onNuxtReady(() => {
    watch(
      () => fetching.value,
      (newFetching) => {
        if (newFetching || isLoggedIn.value) {
          return
        }
        trackCustomerData({
          isLoggedIn: false,
          customerType: 'guest',
        })
      },
      { once: true },
    )
  })
}
