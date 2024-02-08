export const useCustomerDataChangeWatcher = async () => {
  const { isLoggedIn, forceRefresh, customerType, user } = await useUser()

  const { trackCustomerData } = useTrackingEvents()

  const currentUserId = useState<number | undefined>('current-user-id')

  watch(
    () => user.value,
    (userData) => {
      if (!userData) {
        currentUserId.value = undefined
      }

      if (currentUserId.value === userData?.id) {
        return
      }

      currentUserId.value = userData?.id

      trackCustomerData({
        isLoggedIn: isLoggedIn.value,
        customerType: customerType.value,
        user: userData,
      })
    },
  )

  tryOnMounted(async () => {
    if (!isLoggedIn.value) {
      await forceRefresh()
    }

    if (currentUserId.value) {
      return
    }

    trackCustomerData({
      isLoggedIn: isLoggedIn.value,
      customerType: customerType.value,
      user: user.value,
    })
  })
}
