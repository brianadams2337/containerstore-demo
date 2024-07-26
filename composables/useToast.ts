import { refreshNuxtData } from '#app/composables/asyncData'
import type {
  NotificationOnClickActions,
  NotificationComponent,
} from '#storefront-ui'
import type { RouteLocationRaw } from '#vue-router'
import { useNotification } from '#storefront-ui'
import { useNuxtApp } from '#app'

export type ToastAction = 'CONFIRM' | 'RELOAD' | 'ROUTE'
export type ToastType = 'INFO' | 'SUCCESS' | 'ERROR'
export type ToastOptions = {
  duration?: number
  action?: ToastAction
  type?: ToastType
  to?: RouteLocationRaw
}

export function useToast() {
  const { $i18n } = useNuxtApp()
  const notification = useNotification()

  const getActions = (action: ToastAction, to?: RouteLocationRaw) => {
    const classes = 'font-normal text-transform-unset'
    const actions = {
      CONFIRM: [
        {
          class: classes,
          text: $i18n.t('notification.ok'),
          onClick: (actions: NotificationOnClickActions) => actions.close(),
        },
      ],
      ROUTE: [
        {
          class: classes,
          text: $i18n.t('notification.view'),
          href: to,
        },
      ],
      RELOAD: [
        {
          class: classes,
          text: $i18n.t('notification.loaded_again'),
          onClick: (actions: NotificationOnClickActions) => actions.close(),
        },
        {
          class: classes,
          text: 'X',
          onClick: () => Promise.resolve(refreshNuxtData()),
        },
      ],
    }

    return actions[action]
  }

  const getType = (toastType?: ToastType): NotificationComponent => {
    if (!toastType) {
      return {
        classes: 'text-white bg-black',
      }
    }

    const type = {
      SUCCESS: {
        classes: 'text-emerald-500 bg-emerald-100',
        iconComponent: 'IconCheckGreen',
      },
      INFO: {
        classes: 'text-blue-600 bg-blue-100',
        iconComponent: 'IconInfo',
      },
      ERROR: {
        classes: 'text-red-600 bg-red-100',
        iconComponent: 'IconError',
      },
    }

    return type[toastType]
  }

  const show = (message: string, options: ToastOptions) => {
    const { action, type, to } = options

    notification.show(message, {
      ...options,
      actions: action && getActions(action, to),
      type: getType(type),
    })
  }

  return {
    show,
  }
}
