type UiState = 'default' | 'confirmDelete'

export function useBasketItemUiState(key: string) {
  const state = useState<UiState>(
    `basket-item-ui-state-${key}`,
    () => 'default',
  )

  const setUiState = (value: UiState) => {
    state.value = value
  }

  const uiState = readonly(state)

  return {
    uiState,
    setUiState,
  }
}
