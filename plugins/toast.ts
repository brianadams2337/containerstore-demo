import type { RouteLocationRaw } from '#vue-router'

export default defineNuxtPlugin(() => {
  const alerts = ref<Alert[]>([])

  const getAction = (action: Action, to?: RouteLocationRaw) => {
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

  const show = (message: string, action: Action, to?: RouteLocationRaw) => {
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
