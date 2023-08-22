import { joinURL } from 'ufo'

export default () => {}

export function getImage(src: any, { modifiers, baseURL }: any = {}) {
  const keyMap = {
    width: 'width',
    height: 'height',
    quality: 'quality',
    background: 'bg',
    // format: 'format',
  }

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
  const isURL = (src: string): boolean =>
    src.toLowerCase().match(
      new RegExp(
        '^(https?:\\/\\/)?' + // validate protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
          '(\\#[-a-z\\d_]*)?$',
        'i',
      ),
    ) !== null

  const url = isURL(src)
    ? src + (operations ? `?${operations}` : '')
    : joinURL(baseURL, src + (operations ? `?${operations}` : ''))
  return {
    url,
  }
}
