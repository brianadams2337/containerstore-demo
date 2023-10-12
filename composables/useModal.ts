export default () => {
  const state = useState<{ isOpen: boolean }>('modal-state', () => ({
    isOpen: false,
  }))

  const toggle = (isOpen: boolean) => {
    state.value.isOpen = isOpen
  }

  const isOpen = computed(() => state.value.isOpen)

  return {
    isOpen,
    toggle,
  }
}
