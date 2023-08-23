import {
  required,
  email,
  createI18nMessage,
  sameAs,
  maxLength,
} from '@vuelidate/validators'
import { getPayloadDate, dateValidator } from '@scayle/storefront-nuxt'
import { snake as snakeCase } from 'radash'
import { useNuxtApp } from '#app'

const isValidDate = (date: Date) => new Date(date).toString() !== 'Invalid Date'

// This needs to be aligned with CO frontend configuration in Panel
// Validates that a password has at least 8 characters, a special, an uppercase
const validatePassword = (value: string): boolean => {
  const pattern = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,70}$/.test(value)
  return pattern && !value.includes(' ')
}

const validateDate = (value: string): boolean => dateValidator(value)

const validateFutureDate = (value: string): boolean => {
  const formattedDate = getPayloadDate(value)
  if (!formattedDate) {
    return true
  }
  const date = new Date(formattedDate)
  if (!isValidDate(date)) {
    return true
  }
  const now = new Date()
  return date.getTime() < now.getTime()
}

const validateName = (value: string | undefined): boolean => {
  if (!value) {
    return true
  }
  const hasValidUnicodeLetters = /^[\p{Letter}\s'-.]+$/u.test(value)
  const hasPunctuationStreak = /['-.]{2,}/.test(value)
  const hasValidBoundaries = !/^['-.].*|['.-]$/.test(value)
  return hasValidUnicodeLetters && hasValidBoundaries && !hasPunctuationStreak
}

export default defineNuxtPlugin(() => {
  const { $i18n } = useNuxtApp()

  const withI18nMessage = createI18nMessage({
    t: $i18n.t.bind($i18n),
    messagePath: ({ $validator }) => `validation.${snakeCase($validator)}`,
    // @ts-ignore
    // TS ignore is needed since the return type is not correct here.
    // https://github.com/vuelidate/vuelidate/issues/1180
    messageParams: ({ field, max, otherName, property, ...params }) => ({
      ...params,
      field: $i18n.t(`form_fields.${snakeCase(field || property)}`),
      max,
      otherField: otherName,
    }),
  })

  const rule = {
    required: withI18nMessage(required),
    email: withI18nMessage(email),
    date: withI18nMessage(validateDate),
    password: withI18nMessage(validatePassword),
    futureDate: withI18nMessage(validateFutureDate),
    name: withI18nMessage(validateName),
    sameAs: withI18nMessage(sameAs, { withArguments: true }),
    maxLength: withI18nMessage(maxLength, { withArguments: true }),
  }

  return { provide: { validation: { rule } } }
})
