import { MarginKey } from '../types/storyblok'

const useStoryblokMargins = (content: Partial<{ margin_top: MarginKey }>) => {
  const margins: Record<MarginKey, string> = {
    '': '',
    xs: 'mt-2',
    sm: 'mt-4',
    md: 'mt-8',
    lg: 'mt-12',
    xl: 'mt-16',
    '2xl': 'mt-20',
    '3xl': 'mt-24',
    '4xl': 'mt-28',
  }

  const marginTop = computed(
    () => content.margin_top && margins[content.margin_top],
  )
  const marginClasses = computed(() =>
    content.margin_top ? [marginTop.value] : [''],
  )

  return {
    marginTop,
    marginClasses,
  }
}

export default useStoryblokMargins
