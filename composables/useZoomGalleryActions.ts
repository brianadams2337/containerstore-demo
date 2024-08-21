import { useState } from '#app/composables/state'

export function useZoomGalleryActions() {
  const display = useState('zoom-gallery-display', () => false)
  const index = useState('zoom-gallery-display-index', () => -1)

  const toggle = (_display: boolean, _index?: number) => {
    display.value = _display

    if (_index) {
      index.value = _index
    }
  }

  return {
    display,
    index,
    toggle,
  }
}
