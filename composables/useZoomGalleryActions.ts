export function useZoomGalleryActions() {
  const state = ref({
    display: false,
    index: -1,
  })

  const toggle = (display: boolean, index?: number) => {
    state.value.display = display

    if (index) {
      state.value.index = index
    }
  }

  return {
    state: readonly(state),
    toggle,
  }
}
