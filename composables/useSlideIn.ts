export default (name: string) => {
  const isOpen = useState(`${name}-slide-in`, () => false)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return { isOpen, toggle }
}
