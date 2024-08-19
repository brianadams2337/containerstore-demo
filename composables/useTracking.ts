import { debounce } from 'radash'
import type { Log } from '@scayle/storefront-nuxt'
import { useEventListener } from '@vueuse/core'
import { useGtm } from '@gtm-support/vue-gtm'
import { useRuntimeConfig } from '#app'
import { useLog } from '#storefront/composables'
import { useState } from '#app/composables/state'
import { usePageState } from '~/composables/usePageState'

const WAIT_TIME = 1000

// TODO Handle tracking events when `gtm` is not initialized (server-side)
const handleNonInitializedTracking = (log: Log) => ({
  push: (data: unknown) => {
    log.warn(`Gtm was not initialized yet. Event: ${JSON.stringify(data)}`)
  },
  hasEventInQueue: (eventName: string) => {
    log.warn(
      `Gtm was not initialized yet. "${eventName} does not exist in queue`,
    )
  },
})

export function useTracking() {
  // NOTE: use gtm will only return a gtm instance on client side.
  const gtm = useGtm()
  const log = useLog('tracking')

  if (!gtm) {
    return handleNonInitializedTracking(log)
  }

  const { pageState } = usePageState()

  const config = useRuntimeConfig()

  type Push = typeof gtm.push
  type DataLayerObject = Parameters<typeof gtm.push>[0]

  let lastIndex = -1

  const queue = useState<{ data: DataLayerObject; index: number }[]>(
    'tracking-queue',
    () => [],
  )

  const push: Push = (data) => {
    const trackingEvents = (config.public.trackingEventOrder as string[]) ?? []
    const index = data.event ? trackingEvents.indexOf(data.event) ?? -1 : -1
    if (index === -1) {
      return queue.value.push({ data, index: lastIndex })
    }
    queue.value.push({ data, index })
    lastIndex = index
    flushDebounced()
  }

  const flush = () => {
    const sortedEvents = queue.value.sort((a, b) => a.index - b.index)
    sortedEvents.forEach((item) => {
      if ('ecommerce' in item.data) {
        gtm.push({ ecommerce: null }) // Clear the previous ecommerce object.
      }

      const {
        event,
        content_name: contentName,
        page_type: pageType,
        page_type_id: pageTypeId,
        ...data
      } = item.data

      gtm.push({
        event,
        ...(contentName && { content_name: contentName }),
        page_type: pageType || pageState.value.type,
        page_type_id: pageTypeId || pageState.value.typeId,
        ...data,
      })
    })
    queue.value.length = 0
  }

  const hasEventInQueue = (eventName: string) => {
    return queue.value.some((item) => item.data.event === eventName)
  }

  const flushDebounced = debounce({ delay: WAIT_TIME }, flush)

  useEventListener('beforeunload', flush)

  return { push, hasEventInQueue }
}
