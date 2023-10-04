export default defineNuxtRouteMiddleware(async (to) => {
  const { isLoggedIn, user } = await useUser()

  const localePath = useLocalePath()

  const protectedRoutes = Object.values(
    usePick(routeList, ['account', 'orders', 'orderDetail', 'user']),
  ).map((it) => localePath(it.path))

  const isGuest = !!user.value?.status?.isGuestCustomer

  const isProtectRoute =
    isGuest && protectedRoutes.some((path) => to.path === path)

  if (isLoggedIn.value && isProtectRoute) {
    return navigateTo({ path: localePath(routeList.home.path) })
  }
})
