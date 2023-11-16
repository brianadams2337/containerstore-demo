export interface LastLoggedInUser {
  firstName: string
  email: string
}

const USER_KEY = 'last_logged_in_user'

export const setUserDefault = (): LastLoggedInUser => ({
  firstName: '',
  email: '',
})

export const useLastLoggedInUser = async () => {
  const { user, isLoggedIn } = await useUser()
  const lastLoggedInUser = useState(USER_KEY, setUserDefault)

  const isLocalStorageActionable = () => {
    const isLocalStorageAvailable =
      window.localStorage && 'localStorage' in window

    const isWindowAvailable = typeof window !== 'undefined'

    return process.client && isWindowAvailable && isLocalStorageAvailable
  }

  const getLastLoggedInUser = () => {
    if (isLocalStorageActionable()) {
      const entry = window.localStorage.getItem(USER_KEY)
      return entry && JSON.parse(atob(entry))
    }

    return setUserDefault()
  }

  const setLastLoggedInUser = (user: LastLoggedInUser) => {
    if (isLocalStorageActionable()) {
      return window.localStorage.setItem(USER_KEY, btoa(JSON.stringify(user)))
    }
  }

  const removeLastLoggedInUser = () => {
    setLastLoggedInUser(setUserDefault())
    lastLoggedInUser.value = setUserDefault()
  }

  watch(isLoggedIn, () => {
    if (isLoggedIn.value) {
      const isGuest = user.value?.status?.isGuestCustomer

      if (isGuest) {
        return
      }

      setLastLoggedInUser({
        firstName: user.value!.firstName,
        email: user.value!.email || '',
      })
    }
  })

  tryOnBeforeMount(() => {
    // we need to set default value onMounted to avoid possible race conditions with local storage
    lastLoggedInUser.value = getLastLoggedInUser() || {
      email: '',
      firstName: '',
    }
  })

  return {
    lastLoggedInUser,
    getLastLoggedInUser,
    setLastLoggedInUser,
    removeLastLoggedInUser,
  }
}
