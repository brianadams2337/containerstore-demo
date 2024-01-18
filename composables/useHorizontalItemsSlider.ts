export function useHorizontalItemsSlider() {
  const sliderRef = useState<any>('slider')
  /**
   * This is because scrollTop/scrollLeft are non-rounded
   * numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
   */
  const ARRIVED_STATE_THRESHOLD_PIXELS = 1

  const arrivedRight = ref(false)
  const arrivedLeft = ref(true)
  const x = ref(0)

  const onScroll = () => {
    if (process.server) {
      return
    }
    const scrollLeft = sliderRef.value?.scrollLeft
    arrivedRight.value =
      scrollLeft + sliderRef.value?.clientWidth >=
      sliderRef.value?.scrollWidth - ARRIVED_STATE_THRESHOLD_PIXELS
    arrivedLeft.value = scrollLeft <= 0
    x.value = scrollLeft
  }

  const getSlideWidth = () => {
    const slideCount = sliderRef.value.children.length
    return sliderRef.value.scrollWidth / slideCount
  }

  const next = (offset = 0) => {
    if (!isNextEnabled.value) {
      return
    }

    sliderRef.value.scrollTo({
      top: 0,
      left: x.value + getSlideWidth() + offset,
      behavior: 'smooth',
    })
  }
  const prev = (offset = 0) => {
    if (!isPrevEnabled.value) {
      return
    }

    sliderRef.value.scrollTo({
      top: 0,
      left: x.value - getSlideWidth() + offset,
      behavior: 'smooth',
    })
  }

  const scrollImageIntoView = (
    index: number,
    scrollBehavior: 'smooth' | 'auto' = 'auto',
  ) => {
    if (!sliderRef.value) {
      return
    }

    sliderRef.value.scrollTo({
      left: sliderRef.value.offsetWidth * index,
      behavior: scrollBehavior,
    })
  }

  const isNextEnabled = computed(() => !arrivedRight.value)

  const isPrevEnabled = computed(() => !arrivedLeft.value)

  return {
    sliderRef,
    onScroll,
    next,
    prev,
    isNextEnabled,
    isPrevEnabled,
    scrollImageIntoView,
  }
}
