// @vitest-environment nuxt
import { afterEach, describe, expect, it } from 'vitest'
import { useNotification } from '.'

describe('useNotification', () => {
  afterEach(() => useNotification().closeAll())

  it('should have empty notifications by default', () => {
    const { notifications } = useNotification()
    expect(notifications.value).toEqual([])
  })

  it('should show notification with the correct payload', () => {
    const { show, notifications } = useNotification()
    show('route notification', {
      duration: 2000,
      actions: [{ text: 'VIEW', href: '/' }],
      type: {
        classes: 'text-white bg-black',
      },
    })
    const { id, actions, ...payload } = notifications.value[0]

    expect(id).toBeTruthy()

    expect({ href: actions?.[0].href, text: actions?.[0].text }).toEqual({
      href: '/',
      text: 'VIEW',
    })
    expect(payload).toEqual({
      message: 'route notification',
      duration: 2000,
      type: {
        classes: 'text-white bg-black',
      },
    })
  })

  it('should close notification', () => {
    const { show, close, notifications } = useNotification()
    show('confirm notification', {
      actions: [{ text: 'OK' }],
      type: {
        classes: 'text-white bg-black',
      },
    })
    const notification = notifications.value[0]
    close(notification.id)
    expect(notifications.value).toEqual([])
  })

  it('should close all notifications', () => {
    const { show, closeAll, notifications } = useNotification()
    show('first notification', {
      type: {
        classes: 'text-white bg-black',
      },
    })
    show('second notification', {
      type: {
        classes: 'text-white bg-black',
      },
    })
    closeAll()
    expect(notifications.value).toEqual([])
  })
})
