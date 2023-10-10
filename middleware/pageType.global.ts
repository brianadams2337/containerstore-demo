export default defineNuxtRouteMiddleware((to) => {
  const store = useStore()

  store.value.pageType = to.meta.pageType as PageType
  // reset page type id before each navigation
  store.value.pageTypeId = ''
})
