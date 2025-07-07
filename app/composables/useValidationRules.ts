import {
  createI18nMessage,
  email,
  maxLength,
  required,
  minLength,
  sameAs,
} from '@vuelidate/validators'
import { useNuxtApp } from '#app'

/**
 * Validates that a password has at least 8 characters, a special, an uppercase.
 * This rules needs to be aligned with CO frontend configuration in Panel.
 * @param value - The password to validate.
 * @returns `true` if the password is valid, `false` otherwise.
 */
const validatePassword = (value: string): boolean => {
  const pattern = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,70}$/.test(value)
  return pattern && !value.includes(' ')
}

/**
 * Validates that a date is in the past.
 * @param value - The date to validate.
 * @returns `true` if the date is in the past, `false` otherwise.
 */

const validatePastDate = (value: string): boolean => {
  if (!value) {
    return true
  }
  const now = new Date()
  return new Date(value).getTime() < now.getTime()
}
/**
 * Validates that a date is a valid date and not older than 1.1.1900.
 * @param value - The date to validate.
 * @returns `true` if the date is valid, `false` otherwise.
 */
const validateDate = (value: string): boolean => {
  if (!value) {
    return true
  }
  return new Date(value).getTime() > new Date(1900, 0, 1).getTime()
}

/**
 * Validates that a value only contains valid unicode letters, spaces, and punctuation.
 * @param value - The name to validate.
 * @returns `true` if the name is valid, `false` otherwise.
 */
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

/**
 * Converts a string to snake case.
 * @param stringValue - The string to convert.
 * @returns The string in snake case.
 */
const toSnakeCase = (stringValue: string) =>
  stringValue
    // eslint-disable-next-line sonarjs/concise-regex,sonarjs/slow-regex,sonarjs/regex-complexity
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('_')

/**
 * Returns a set of vuelidate validation rules that can be used to validate form fields.
 * These rules will resolve the validation messages from the i18n file.
 * `validation.${toSnakeCase($validator)}` will be used for the  validation message key.
 * `form_fields.${toSnakeCase(field || property)}` will be used for the field/property label.
 * @returns A set of validation rules.
 */
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
    /**
     * Validates that a value is required.
     */
    required: withI18nMessage(required),
    /**
     * Validates that a value is a valid email address.
     */
    email: withI18nMessage(email),
    /**
     * Validates that a value is a valid date after 1.1.1900.
     */
    date: withI18nMessage(validateDate),
    /**
     * Validates that a password has at least 8 characters, a special, an uppercase.
     */
    password: withI18nMessage(validatePassword),
    /**
     * Validates that a date is in the past.
     */
    pastDate: withI18nMessage(validatePastDate),
    /**
     * Validates that a value only contains valid unicode letters, spaces, and punctuation.
     */
    name: withI18nMessage(validateName),
    /**
     * Validates that a value is the same as another value.
     */
    sameAs: withI18nMessage(sameAs, { withArguments: true }),
    /**
     * Validates that a value has a maximum length.
     */
    maxLength: withI18nMessage(maxLength, { withArguments: true }),
    /**
     * Validates that a value has a minimum length.
     */
    minLength: withI18nMessage(minLength, { withArguments: true }),
  }
}
