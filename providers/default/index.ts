import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'

export default () => {}

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {} } = {},
  ctx,
) => {
  const keyMap = {
    width: 'width',
    height: 'height',
    quality: 'quality',
    background: 'bg',
    // format: 'format',
  }

  const baseURL = ctx.options.runtimeConfig.public.cdnUrl

  if (modifiers.width && !modifiers.height) {
    modifiers.height = Math.ceil((modifiers.width * 4) / 3)
  }

  // TODO: Find out how to configure desired format
  delete modifiers.format

  const formatter = (key: string, value: string | number) => `${key}=${value}`

  const operations = Object.entries(modifiers)
    .filter(([_, value]) => typeof value !== 'undefined')
    .map(([key, value]) => {
      const mappedKey = (keyMap as any)[key] ?? key
      // const mappedValue = (valueMap as any)[value] ?? value

      return formatter(mappedKey, value as any)
    })
    .join('&')

  const url = URL.canParse(src)
    ? src + (operations ? `?${operations}` : '')
    : joinURL(baseURL, src + (operations ? `?${operations}` : ''))
  return {
    url,
  }
}
