import {
  createI18nMessage,
  email,
  maxLength,
  required,
  minLength,
  sameAs,
} from '@vuelidate/validators'
import { dateValidator, getPayloadDate } from '@scayle/storefront-nuxt'
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
  // eslint-disable-next-line sonarjs/anchor-precedence
  const hasValidBoundaries = !/^['-.].*|['.-]$/.test(value)
  return hasValidUnicodeLetters && hasValidBoundaries && !hasPunctuationStreak
}

const toSnakeCase = (stringValue: string) =>
  stringValue
    // eslint-disable-next-line sonarjs/concise-regex,sonarjs/slow-regex,sonarjs/regex-complexity
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('_')

export function useValidationRules() {
  const { $i18n } = useNuxtApp()

  const withI18nMessage = createI18nMessage({
    t: $i18n.t.bind($i18n),
    messagePath: ({ $validator }) => `validation.${toSnakeCase($validator)}`,
    messageParams: ({ field, max, otherName, property, ...params }) => ({
      ...params,
      property,
      field: $i18n.t(`form_fields.${toSnakeCase(field || property)}`),
      max,
      otherField: otherName,
    }),
  })

  return {
    required: withI18nMessage(required),
    email: withI18nMessage(email),
    date: withI18nMessage(validateDate),
    password: withI18nMessage(validatePassword),
    futureDate: withI18nMessage(validateFutureDate),
    name: withI18nMessage(validateName),
    sameAs: withI18nMessage(sameAs, { withArguments: true }),
    maxLength: withI18nMessage(maxLength, { withArguments: true }),
    minLength: withI18nMessage(minLength, { withArguments: true }),
  }
}
