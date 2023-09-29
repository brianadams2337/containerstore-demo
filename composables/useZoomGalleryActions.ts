const useZoomGalleryActions = () => {
  const state = reactive({
    display: false,
    index: -1,
  })

  const toggle = (display: boolean, index?: number) => {
    state.display = display

    if (index) {
      state.index = index
    }
  }

  return {
    state,
    toggle,
  }
}

export default useZoomGalleryActions
