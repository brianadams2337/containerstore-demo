import type { LinkList } from '~/utils/route'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.includes('/api')) {
    return
  }
  const nuxt = useNuxtApp()
  const getLocalePath = useLocalePath()
  const userComposable = await useUser()
  const user = nuxt?.ssrContext
    ? nuxt?.ssrContext?.event?.context.$rpcContext.user
    : userComposable.user.value

  const localePath = (routePath: LinkList[keyof LinkList]['path']) => {
    return getLocalePath(routePath) || routePath
  }

  const isProtectedRoute = (exclude?: string) => {
    const routes = getProtectedRouteList(exclude)

    return routes.find(
      (protectedRoute) => localePath(protectedRoute) === to.path,
    )
  }

  const isGuest = !!user?.status?.isGuestCustomer

  const isProtectRouteForGuest = isGuest && isProtectedRoute('checkout')

  if (!user && isProtectedRoute()) {
    return navigateTo({
      path: localePath(routeList.signin.path),
      query: {
        redirectUrl: to.fullPath,
      },
    })
  }
  if (user && isProtectRouteForGuest) {
    const redirectPath =
      (to.query.redirectUrl as string) || localePath(routeList.home.path)
    return navigateTo({ path: redirectPath })
  }
})
