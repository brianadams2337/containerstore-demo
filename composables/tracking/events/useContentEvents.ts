const useContentEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => ({
  trackContentView: (
    contentName: string,
    title: string,
    pageType: PageType,
    pageTypeId: string,
    clickOrigin?: string,
  ) => {
    track('content_view', {
      content_name: contentName,
      title,
      page_type: pageType,
      page_type_id: pageTypeId,
      click_origin: clickOrigin,
    })
  },
})
export default useContentEvents
