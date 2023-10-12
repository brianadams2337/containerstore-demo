export default () => {
  const isActive = ref<boolean>(false)

  const setActive = (value: boolean) => {
    isActive.value = value
  }

  return {
    setActive,
    isActive: computed(() => isActive.value),
  }
}
