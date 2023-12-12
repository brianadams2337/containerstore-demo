export default defineNuxtPlugin(() => {
  const router = useRouter()
  const { pageState } = usePageState()
  const { $tracking } = useNuxtApp()

  router?.afterEach((to, from) => {
    $tracking.push(
      mapTrackingDataForEvent('content_view', {
        content_name: to.path,
        title: (typeof document !== 'undefined' && document.title) || '',
        page_type: pageState.value.type,
        page_type_id: pageState.value.typeId,
        click_origin: from?.fullPath,
      }),
    )
  })
})
