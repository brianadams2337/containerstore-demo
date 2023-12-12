export default defineNuxtRouteMiddleware((to) => {
  const { setPageState } = usePageState()

  setPageState('type', to.meta.pageType as PageType)
  // reset page type id before each navigation
  setPageState('typeId', '')
})
