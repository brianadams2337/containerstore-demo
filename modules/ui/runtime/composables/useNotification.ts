import { nanoid } from 'nanoid'
import type { RouteLocationRaw } from '#vue-router'
import { useNuxtApp, useState, refreshNuxtData } from 'nuxt/app'
import { computed } from 'vue'

export const DEFAULT_NOTIFICATION_DURATION = 5000

type AppNotificationAction = 'CONFIRM' | 'RELOAD' | 'ROUTE'

type AppNotificationOptions = Partial<{
  duration: number
  to: RouteLocationRaw
}>

type NotificationOnClickActions = { close: () => void }

export type NotificationActionHandler = {
  text: string
  class?: string
  href?: RouteLocationRaw
  onClick?: (_: Event, actions: NotificationOnClickActions) => void
}

export type AppNotification = {
  id: string
  message: string
  duration: number
  actions: NotificationActionHandler[]
}

export function useNotification() {
  const { $i18n } = useNuxtApp()

  const notifications = useState<AppNotification[]>('notifications', () => [])

  const getAction = (action: AppNotificationAction, to?: RouteLocationRaw) => {
    const actionClasses = 'font-normal text-transform-unset'
    const actions = {
      CONFIRM: [
        {
          class: actionClasses,
          text: $i18n.t('notification.ok'),
          onClick: (_: Event, actions: NotificationOnClickActions) =>
            actions.close(),
        },
      ],
      ROUTE: [
        {
          class: actionClasses,
          text: $i18n.t('notification.view'),
          href: to,
        },
      ],
      RELOAD: [
        {
          class: actionClasses,
          text: $i18n.t('notification.loaded_again'),
          onClick: (_: Event, actions: NotificationOnClickActions) =>
            actions.close(),
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

  const show = (
    message: string,
    action: AppNotificationAction,
    { to, duration }: AppNotificationOptions = {},
  ) => {
    notifications.value.push({
      id: `${nanoid()}-${Date.now()}`,
      message,
      duration: duration || DEFAULT_NOTIFICATION_DURATION,
      actions: getAction(action, to),
    })
  }

  const close = (notificationId: string) => {
    notifications.value = notifications.value.filter(({ id }) => {
      return id !== notificationId
    })
  }

  return {
    notifications: computed(() => notifications.value),
    show,
    close,
  }
}
