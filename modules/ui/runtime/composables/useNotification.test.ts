// @vitest-environment nuxt
import { describe, expect, it, afterEach } from 'vitest'
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
    })
    const { id, actions, ...payload } = notifications.value[0]

    expect(id).toBeTruthy()

    const { href, text } = actions[0]

    expect({ href, text }).toEqual({ href: '/', text: 'VIEW' })
    expect(payload).toEqual({
      message: 'route notification',
      duration: 2000,
    })
  })

  it('should close notification', () => {
    const { show, close, notifications } = useNotification()
    show('confirm notification', { actions: [{ text: 'OK' }] })
    const notification = notifications.value[0]
    close(notification.id)
    expect(notifications.value).toEqual([])
  })

  it('should close all notifications', () => {
    const { show, closeAll, notifications } = useNotification()
    show('first notification')
    show('second notification')
    closeAll()
    expect(notifications.value).toEqual([])
  })
})
