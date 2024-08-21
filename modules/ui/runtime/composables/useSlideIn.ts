import { readonly } from 'vue'
import { useState } from '#app/composables/state'

export function useSlideIn(name: string) {
  const isOpen = useState(`${name}-slide-in`, () => false)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const close = () => {
    isOpen.value = false
  }

  return {
    isOpen: readonly(isOpen),
    toggle,
    close,
  }
}
