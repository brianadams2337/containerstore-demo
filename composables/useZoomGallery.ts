export default (imageCount: number) => {
  const containerRef: Ref<HTMLElement | null> = ref(null)
  const doubleZoomActive = ref(false)
  const doubleZoomOffsetY: Ref<null | number> = ref(null)

  const scrollImageIntoView = (
    index: number,
    scrollBehavior?: 'smooth' | 'auto',
  ) => {
    if (!containerRef.value) {
      return
    }

    containerRef.value.scrollTo({
      left: containerRef.value.offsetWidth * index,
      behavior: scrollBehavior,
    })
  }

  const wrapAroundIndex = (index: number) => {
    if (index < 0) {
      return imageCount - 1
    }
    if (index < imageCount) {
      return index
    }
    return index % imageCount
  }

  const updateZoomYOffset = (event: MouseEvent) => {
    if (!event || !doubleZoomActive.value) {
      return
    }
    doubleZoomOffsetY.value = event.offsetY
  }

  const toggleDoubleZoom = (event: MouseEvent) => {
    if (!doubleZoomActive.value) {
      updateZoomYOffset(event)
    }
    doubleZoomActive.value = !doubleZoomActive.value
  }

  onUnmounted(() => {
    containerRef.value = null
  })

  return {
    wrapAroundIndex,
    scrollImageIntoView,
    containerRef,
    doubleZoomActive,
    doubleZoomOffsetY,
    updateZoomYOffset,
    toggleDoubleZoom,
  }
}
