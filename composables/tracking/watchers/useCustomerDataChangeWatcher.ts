export const useCustomerDataChangeWatcher = async () => {
  const { isLoggedIn, customerType, user } = await useUser()

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

  onNuxtReady(() => {
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
