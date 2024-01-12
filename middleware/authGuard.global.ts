export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, user } = await useUser()

  const localePath = (routePath: LinkList[keyof LinkList]['path']) => {
    const getLocalePath = useLocalePath({ route: routePath })
    return getLocalePath(routePath) || routePath
  }

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
    return navigateTo({
      path: localePath(routeList.signin.path),
      query: {
        redirectUrl: to.fullPath,
      },
    })
  }
  if (isLoggedIn.value && isProtectRouteForGuest) {
    const redirectPath = (to.query.redirectUrl as string) || routeList.home.path
    return navigateTo({ path: redirectPath })
  }
})
