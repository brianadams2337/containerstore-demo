export function useModal() {
  const isOpen = useState<boolean>('is-modal-open', () => false)

  const toggle = (value: boolean) => {
    isOpen.value = value
  }

  return {
    isOpen: readonly(isOpen),
    toggle,
  }
}
