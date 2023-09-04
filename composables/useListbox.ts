const useListbox = <T = object>(name: string) => {
  const isOpen = useState<boolean>(`${name}-open`, () => false)
  const _activeValue = useState<T>(`${name}-value`, () => ({}) as T)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const setActive = (value: T) => {
    _activeValue.value = value
  }

  return { activeValue: _activeValue, isOpen, toggle, setActive }
}

export default useListbox
