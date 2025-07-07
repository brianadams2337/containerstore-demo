import { expect, it } from 'vitest'
import { FetchError } from 'ofetch'
import { resolveErrorMessage } from './authentication'
import type { Composer } from '#i18n'

const httpErrorMessages = {
  400: 'authentication.notification.error.generic.400',
  401: 'authentication.notification.error.generic.401',
  403: 'authentication.notification.error.generic.403',
  404: 'authentication.notification.error.generic.404',
  406: 'authentication.notification.error.generic.406',
  409: 'authentication.notification.error.generic.409',
  422: 'authentication.notification.error.generic.422',
  500: 'authentication.notification.error.generic.500',
}

it.each(Object.entries(httpErrorMessages))(
  'should return correct generic error message for %s',
  (status, expectedMessage) => {
    const error = new FetchError('Fetch Error')
    Object.assign(error, { response: { status: Number(status) } })

    const i18n = {
      t: (key: string) => key,
      te: (key: string) => key in httpErrorMessages,
    } as unknown as Composer
    const result = resolveErrorMessage(error, 'forgot_password', i18n)

    expect(result).toBe(expectedMessage)
  },
)

it('should return correct event specific error messages', () => {
  const error = new FetchError('Fetch Error')
  Object.assign(error, { response: { status: Number(400) } })

  const i18n = {
    t: (key: string) => key,
    te: (_key: string) => true,
  } as unknown as Composer
  const result = resolveErrorMessage(error, 'login', i18n)

  expect(result).toBe('authentication.notification.error.login.400')
})
