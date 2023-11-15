import type { RouteLocationRaw } from '#vue-router'

export {}

declare global {
  type Action = 'CONFIRM' | 'RELOAD' | 'ROUTE'

  type ToastObject = { close: () => void }

  interface ActionHandler {
    text: string
    class?: string
    href?: RouteLocationRaw
    onClick?: (_: Event, toastObject: ToastObject) => void
  }

  interface Alert {
    id: number
    message: string
    duration: number
    actions: ActionHandler[]
  }
}
