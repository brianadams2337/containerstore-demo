import type {
  NotificationOnClickActions,
  NotificationOptions,
} from '#storefront-ui'
import type { RouteLocationRaw } from '#vue-router'
import { useNotification } from '#storefront-ui'
import { refreshNuxtData } from 'nuxt/app'

type ToastAction = 'CONFIRM' | 'RELOAD' | 'ROUTE'

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

  const show = (
    message: string,
    action: ToastAction,
    { to, ...options }: NotificationOptions & { to?: RouteLocationRaw } = {},
  ) => {
    notification.show(message, {
      ...options,
      actions: getActions(action, to),
    })
  }

  return {
    show,
  }
}
