import { RouteLocationRaw } from '#vue-router'
import { Action } from '~/constants'

type ToastObject = { close: () => void }

export interface ActionHandler {
  text: string
  class?: string
  href?: RouteLocationRaw
  onClick?: (_: Event, toastObject: ToastObject) => void
}

export interface Alert {
  id: number
  message: string
  duration: number
  actions: ActionHandler[]
}

export default defineNuxtPlugin(() => {
  const alerts = ref<Alert[]>([])

  const getAction = (action: Action, to?: string) => {
    const actionClasses = 'font-normal text-transform-unset'
    const actions = {
      CONFIRM: [
        {
          class: actionClasses,
          text: 'OK',
          onClick: (_: Event, toastObject: ToastObject) => toastObject.close(),
        },
      ],
      ROUTE: [
        {
          class: actionClasses,
          text: 'View',
          href: to,
        },
      ],
      RELOAD: [
        {
          class: actionClasses,
          text: 'Erneut laden',
          onClick: (_: Event, toastObject: ToastObject) => toastObject.close(),
        },
        {
          class: actionClasses,
          text: 'X',
          onClick: () => Promise.resolve(refreshNuxtData()),
        },
      ],
    }

    return actions[action]
  }

  const show = (message: string, action: Action, to?: string) => {
    alerts.value.push({
      id: Date.now(),
      message,
      duration: 5000,
      actions: getAction(action, to),
    })
  }

  const close = (toastId: number) => {
    alerts.value = alerts.value.filter(({ id }) => id !== toastId)
  }

  return {
    provide: {
      alert: {
        alerts,
        show,
        close,
      },
    },
  }
})
