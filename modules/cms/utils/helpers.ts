import { createConsola } from 'consola'
import { CMSProvidersMap } from './config'
import { pascal, dash } from 'radash'

export const moduleName = '@scayle/storefront-cms'
export const logger = createConsola({
  fancy: true,
  formatOptions: {
    colors: true,
  },
  level: process.env.ENABLE_NUXT_DEBUGGING ? 3 : -1,
  defaults: {
    tag: moduleName,
  },
})

export function isStringURL(string: string) {
  let url

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export function getComponentName(
  name: string | undefined,
  prefix: string = 'CMS',
) {
  if (!name) {
    return null
  }

  if (name.startsWith('Cms')) {
    name = name.replace('Cms', '')
  }

  // Radash _pascal fails to convert some
  // camelCase names to PascalCase, so we need
  // to convert them to dash-case first
  // https://github.com/rayepps/radash/issues/292
  return `${prefix}${pascal(dash(name))}`
}

export const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
})

export const formattedProvidersKeys = formatter.format(
  Object.values(CMSProvidersMap),
)

export const EMAIL_REGEX_PATTERN =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
