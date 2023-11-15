import type { StoryblokTrackingContent } from '~/storyblok/types/storyblok'

const usePromotionEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => any,
) => ({
  trackPromotion: (
    event: TrackingEvent,
    trackableObject: StoryblokTrackingContent,
  ) => {
    if (!Object.values(trackableObject).some(Boolean)) {
      return
    }
    track(event, {
      items: [
        {
          item_id: trackableObject.item_id,
          item_name: trackableObject.item_name,
          promotion_id: trackableObject.promotion_id,
          promotion_name: trackableObject.promotion_name,
          creative_name: trackableObject.creative_name,
          creative_slot: trackableObject.creative_slot,
          location_id: trackableObject.location_id,
          index: parseInt(`${trackableObject.index}`),
        },
      ],
    })
  },
})

export default usePromotionEvents
