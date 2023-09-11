export interface LastLoggedInUser {
  firstName: string
  email: string
}

const LAST_LOGGED_IN_USER_KEY = 'last_logged_in_user'
export const NO_LAST_LOGGED_IN_USER: LastLoggedInUser = {
  firstName: '',
  email: '',
}

export const useLastLoggedInUser = async () => {
  const { user, isLoggedIn } = await useUser({ autoFetch: false })
  const lastLoggedInUser = useState(
    LAST_LOGGED_IN_USER_KEY,
    () => NO_LAST_LOGGED_IN_USER,
  )

  const getLastLoggedInUser = () => {
    if (
      process.client &&
      typeof window !== 'undefined' &&
      'localStorage' in window &&
      window.localStorage
    ) {
      const entry = window.localStorage.getItem(LAST_LOGGED_IN_USER_KEY)
      if (entry) {
        return JSON.parse(atob(entry))
      }
    }

    return NO_LAST_LOGGED_IN_USER
  }

  const setLastLoggedInUser = (user: LastLoggedInUser) => {
    if (
      process.client &&
      typeof window !== 'undefined' &&
      'localStorage' in window &&
      window.localStorage
    ) {
      return window.localStorage.setItem(
        LAST_LOGGED_IN_USER_KEY,
        btoa(JSON.stringify(user)),
      )
    }
  }

  const removeLastLoggedInUser = () => {
    setLastLoggedInUser(NO_LAST_LOGGED_IN_USER)
    lastLoggedInUser.value = NO_LAST_LOGGED_IN_USER
  }

  watch(isLoggedIn, () => {
    if (isLoggedIn.value) {
      const isGuest = user.value?.status?.isGuestCustomer

      if (!isGuest) {
        setLastLoggedInUser({
          firstName: user.value!.firstName,
          email: user.value!.email || '',
        })
      }
    }
  })

  onBeforeMount(() => {
    // we need to set default value onMounted to avoid possible race conditions with local storage
    lastLoggedInUser.value = getLastLoggedInUser()
  })

  return {
    lastLoggedInUser,
    getLastLoggedInUser,
    setLastLoggedInUser,
    removeLastLoggedInUser,
  }
}
