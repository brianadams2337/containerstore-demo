export default defineNuxtPlugin(() => {
  const router = useRouter()
  const store = useStore()
  const { $tracking } = useNuxtApp()

  router?.afterEach((to, from) => {
    $tracking.push(
      mapTrackingDataForEvent('content_view', {
        content_name: to.path,
        title: (typeof document !== 'undefined' && document.title) || '',
        page_type: store.value.pageType,
        page_type_id: store.value.pageTypeId,
        click_origin: from?.fullPath,
      }),
    )
  })
})
