const listingUiState = reactive({
  columns: 0,
})

export default () => {
  // TODO wireup breakpoints
  //   const { md } = useBreakpoints()
  const md = ref(true)

  if (listingUiState.columns === 0) {
    listingUiState.columns = !md.value ? 2 : 3
  }
  const listingColumns = computed(() => listingUiState.columns)

  const setColumns = (columns: number) => {
    listingUiState.columns = columns
  }

  const isColumn = (number: number): boolean => {
    return number === listingColumns.value
  }

  return {
    listingColumns,
    setColumns,
    isColumn,
  }
}
