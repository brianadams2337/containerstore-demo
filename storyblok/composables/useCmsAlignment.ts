import type { Alignment } from '~/storyblok/types/storyblok'

const useCmsAlignment = (blok: Partial<Alignment>) => {
  return {
    align: computed(() => {
      switch (blok.align) {
        case 'start':
          return ['mb-auto', 'justify-start']
        case 'center':
          return ['my-auto', 'justify-center']
        case 'end':
        default:
          return ['mt-auto', 'justify-end']
      }
    }),

    justify: computed(() => {
      switch (blok.justify) {
        case 'end':
          return ['ml-auto', 'text-right', 'items-end']
        case 'center':
          return ['mx-auto', 'text-center', 'items-center']
        case 'start':
        default:
          return ['mr-auto', 'items-start']
      }
    }),
  }
}

export default useCmsAlignment
