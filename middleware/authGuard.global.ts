import type { LinkList } from '~/utils/route'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.includes('/api')) {
    return
  }
  const { isLoggedIn, user } = await useUser()
  const getLocalePath = useLocalePath()

  const localePath = (routePath: LinkList[keyof LinkList]['path']) => {
    return getLocalePath(routePath) || routePath
  }

  const isProtectedRoute = (exclude?: string) => {
    const routes = getProtectedRouteList(exclude)

    return routes.find(
      (protectedRoute) => localePath(protectedRoute) === to.path,
    )
  }

  const isGuest = !!user.value?.status?.isGuestCustomer

  const isProtectRouteForGuest = isGuest && isProtectedRoute('checkout')

  if (!isLoggedIn.value && isProtectedRoute()) {
    return navigateTo({
      path: localePath(routeList.signin.path),
      query: {
        redirectUrl: to.fullPath,
      },
    })
  }
  if (isLoggedIn.value && isProtectRouteForGuest) {
    const redirectPath =
      (to.query.redirectUrl as string) || localePath(routeList.home.path)
    return navigateTo({ path: redirectPath })
  }
})
