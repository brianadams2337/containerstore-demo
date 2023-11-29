type UiState = 'default' | 'confirmDelete'

export default () => {
  const state = useState<UiState>('basket-item-ui-state', () => 'default')

  const setUiState = (value: UiState) => {
    state.value = value
  }
  const uiState = computed(() => state.value)

  return {
    uiState,
    setUiState,
  }
}
