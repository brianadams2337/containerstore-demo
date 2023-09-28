import { Log } from '@scayle/storefront-nuxt'

const WAIT_TIME = 1000

// TODO Handle tracking events when `gtm` is not initialized (server-side)
const nonInitializedTracking = (log: Log) => ({
  push: (data: any) => {
    log.warn(`Gtm was not initialized yet. Event: ${JSON.stringify(data)}`)
  },
})

export default defineNuxtPlugin(() => {
  // NOTE: use gtm will only return a gtm instance on client side.
  const gtm = useGtm()
  const log = useLog('tracking')

  if (!gtm) {
    return {
      provide: { tracking: nonInitializedTracking(log) },
    }
  }

  type Push = typeof gtm.push

  let lastIndex = -1
  const queue: Array<{ data: any; index: number }> = []

  const tracking: { push: Push } = {
    /**
     * Push data to GTM considering the "trackingEventOrder"
     */
    push: (data) => {
      const { trackingEventOrder } = useRuntimeConfig().public
      const index = data.event
        ? trackingEventOrder.indexOf(data.event) ?? -1
        : -1
      if (index === -1) {
        return queue.push({ data, index: lastIndex })
      }
      queue.push({ data, index })
      lastIndex = index
      flushDebounced()
    },
  }

  const flush = () => {
    const store = useStore()
    const sorted = queue.sort((a, b) => a.index - b.index)
    sorted.forEach((item) => {
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
        page_type: pageType || store.value.pageType,
        page_type_id: pageTypeId || store.value.pageTypeId,
        ...data,
      })
    })
    queue.length = 0
  }

  const flushDebounced = useDebounce({ delay: WAIT_TIME }, flush)

  useEventListener('beforeunload', flush)

  return {
    provide: { tracking },
  }
})
