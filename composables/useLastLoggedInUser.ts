import { useStorage } from '@vueuse/core'

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
  const { user, isLoggedIn, fetching } = await useUser()
  const lastLoggedInUser = useState(USER_KEY, setUserDefault)

  const storage = useStorage<LastLoggedInUser>(
    USER_KEY,
    setUserDefault(),
    window.localStorage,
    {
      serializer: {
        read: (value: any) => (value ? JSON.parse(atob(value)) : null),
        write: (value: any) => btoa(JSON.stringify(value)),
      },
    },
  )

  const removeLastLoggedInUser = () => {
    storage.value = setUserDefault()
    lastLoggedInUser.value = setUserDefault()
  }

  watch(
    () => isLoggedIn.value,
    (value) => {
      if (!value) {
        return
      }

      const isGuest = user.value?.status?.isGuestCustomer

      if (isGuest) {
        return
      }

      storage.value = {
        firstName: user.value!.firstName,
        email: user.value!.email || '',
      }
    },
  )

  tryOnBeforeMount(() => {
    lastLoggedInUser.value = storage.value
  })

  return {
    lastLoggedInUser,
    removeLastLoggedInUser,
    user,
    isLoggedIn,
    isFetching: fetching,
  }
}
