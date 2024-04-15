import { Log } from '@scayle/storefront-nuxt'

const WAIT_TIME = 1000

// TODO Handle tracking events when `gtm` is not initialized (server-side)
const handleNonInitializedTracking = (log: Log) => ({
  push: (data: any) => {
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

  let lastIndex = -1

  const queue = useState<{ data: any; index: number }[]>(
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

  const flushDebounced = _debounce({ delay: WAIT_TIME }, flush)

  useEventListener('beforeunload', flush)

  return { push, hasEventInQueue }
}
