type UiState = 'default' | 'confirmDelete'

export default (key: string) => {
  const state = useState<UiState>(
    `basket-item-ui-state-${key}`,
    () => 'default',
  )

  const setUiState = (value: UiState) => {
    state.value = value
  }
  const uiState = computed(() => state.value)

  return {
    uiState,
    setUiState,
  }
}
