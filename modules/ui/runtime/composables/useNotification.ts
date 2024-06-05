import { nanoid } from 'nanoid'
import { useState } from 'nuxt/app'
import { computed } from 'vue'
import type { RouteLocationRaw } from '#vue-router'

export const DEFAULT_NOTIFICATION_DURATION = 5000

export type NotificationOptions = Partial<{
  duration: number
  actions: NotificationActionHandler[]
}>

export type NotificationOnClickActions = {
  close: () => void
  [key: string]: () => void
}

export type NotificationActionHandler = {
  text: string
  class?: string
  href?: RouteLocationRaw
  onClick?: (actions: NotificationOnClickActions) => void
}

export type StorefrontNotification = {
  id: string
  message: string
  duration: number
  actions: NotificationActionHandler[]
}

export function useNotification() {
  const notifications = useState<StorefrontNotification[]>(
    'notifications',
    () => [],
  )

  const show = (
    message: string,
    { duration, actions = [] }: NotificationOptions = {},
  ) => {
    notifications.value.push({
      id: `${nanoid()}-${Date.now()}`,
      message,
      duration: duration || DEFAULT_NOTIFICATION_DURATION,
      actions,
    })
  }

  const close = (id: string) => {
    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  const closeAll = () => {
    notifications.value = []
  }

  return {
    notifications: computed(() => notifications.value),
    show,
    close,
    closeAll,
  }
}
