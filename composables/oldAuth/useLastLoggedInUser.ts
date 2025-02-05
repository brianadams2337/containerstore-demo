import { useLocalStorage } from '@vueuse/core'
import { watch } from 'vue'
import { useCurrentShop, useUser } from '#storefront/composables'

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
  const currentShop = useCurrentShop()

  const { user, isLoggedIn, status } = useUser()

  const localStorage = useLocalStorage<LastLoggedInUser>(
    `${USER_KEY}-${currentShop.value.shopId}`,
    setUserDefault(),
    {
      serializer: {
        read: (value) => (value ? JSON.parse(atob(value)) : null),
        write: (value) => btoa(JSON.stringify(value)),
      },
    },
  )

  const removeLastLoggedInUser = () => {
    localStorage.value = setUserDefault()
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

      localStorage.value = {
        firstName: user.value!.firstName,
        email: user.value!.email || '',
      }
    },
  )

  return {
    lastLoggedInUser: localStorage,
    removeLastLoggedInUser,
    isLoggedIn,
    status,
  }
}
