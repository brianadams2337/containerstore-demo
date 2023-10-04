export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, user } = await useUser()

  const localePath = useLocalePath()

  const getProtectedRoutes = (exclude: (keyof LinkList)[] = []) => {
    const routes = Object.entries(
      usePick(routeList, [
        'account',
        'orders',
        'orderDetail',
        'checkout',
        'user',
      ]),
    ).reduce((routeMap, [name, value]) => {
      if (exclude.some((routeName) => routeName === name)) {
        return routeMap
      }

      Object.assign(routeMap, { [name]: value })
      return routeMap
    }, {} as Partial<LinkList>)

    return Object.values(routes).map((it) => localePath(it.path))
  }

  const isGuest = !!user.value?.status?.isGuestCustomer

  const isProtectedRoute = getProtectedRoutes().some((path) => to.path === path)
  const isProtectRouteForGuest =
    isGuest && getProtectedRoutes(['checkout']).some((path) => to.path === path)

  if (!isLoggedIn.value && isProtectedRoute) {
    return navigateTo({ path: localePath(routeList.signin.path) })
  }

  if (isLoggedIn.value && isProtectRouteForGuest) {
    return navigateTo({ path: localePath(routeList.home.path) })
  }
})
