import { useLocalStorage } from '@vueuse/core'

export interface LastLoggedInUser {
  firstName: string
  email: string
}

const USER_KEY = 'last_logged_in_user'

export const setUserDefault = (): LastLoggedInUser => ({
  firstName: '',
  email: '',
})

export async function useLastLoggedInUser() {
  const scope = getCurrentScope()
  const { user, isLoggedIn, fetching } = await useUser()
  const lastLoggedInUser = useState(USER_KEY, setUserDefault)

  const localStorage = useLocalStorage<LastLoggedInUser>(
    USER_KEY,
    setUserDefault(),
    {
      serializer: {
        read: (value: any) => (value ? JSON.parse(atob(value)) : null),
        write: (value: any) => btoa(JSON.stringify(value)),
      },
    },
  )

  const removeLastLoggedInUser = () => {
    localStorage.value = setUserDefault()
    lastLoggedInUser.value = setUserDefault()
  }

  scope?.run(() => {
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

        localStorage.value = {
          firstName: user.value!.firstName,
          email: user.value!.email || '',
        }
      },
    )
  })

  tryOnBeforeMount(() => {
    lastLoggedInUser.value = localStorage.value
  })

  return {
    lastLoggedInUser,
    removeLastLoggedInUser,
    isLoggedIn,
    isFetching: fetching,
  }
}
