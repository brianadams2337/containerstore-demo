/**
 * Higher order composable which serves as a single entry point to unify different ecommerce tracking events
 */
export const useTrackingEvents = () => {
  const { $tracking } = useNuxtApp()

  const store = useStore()
  const track = (event: TrackingEvent, payload: TrackingPayload) => {
    if (process.server) {
      return
    }
    const eventData: Partial<{
      event: TrackingEvent
      ecommerce?: TrackingPayload
      content_name?: string
      page_type?: string
      page_type_id?: string
    }> = mapTrackingDataForEvent(event, payload)
    if ('ecommerce' in eventData) {
      eventData.content_name = document.location.pathname
      eventData.page_type = store.value.pageType
      eventData.page_type_id = store.value.pageTypeId
    }

    return $tracking.push(eventData)
  }

  /**
   * NOTE: Important considerations:
   * sub-composable(s) such as useBasketEvents, etc. should not be utilized directly
   * instead make use of the higher order composable (useTrackingEvents) to keep things clean
   * new events should be added to relevant sub-composable to ensure DRY code and separation of concerns
   */

  return {
    ...useShopEvents(track),
    ...useBasketEvents(track),
    ...useWishlistEvents(track),
    ...useProductEvents(track),
    ...useCheckoutEvents(track),
    ...useSearchEvents(track),
    ...usePurchaseEvents(),
    ...useFilterEvents(track),
    ...usePromotionEvents(track),
    ...useUserActionEvents(track),
    ...useCustomerEvents(track),
    ...useContentEvents(track),
    mapProductToTrackingPayload,
    /**  Watcher on basket and wishlist items, to fire tracking events. **/
    listenToUserItemsChanges: useUserItemsTrackingWatcher,
    /** Intercepts historyState changes within the checkout page and fires the corresponding content_view event **/
    listenToCheckoutStepChanges: useCheckoutStepTrackingInterceptor,
    listenToCustomerDataChanges: useCustomerDataChangeWatcher,
  }
}
