const useFilterEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => ({
  trackFilterApply: (action: string, label: string) => {
    track('filter_slider', {
      action,
      label,
    })
  },

  trackFilterFlyout: (action: string, label: string) => {
    track('filter_flyout', {
      action,
      label,
    })
  },
})

export default useFilterEvents
