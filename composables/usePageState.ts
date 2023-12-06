export type PageState = {
  type: PageType
  typeId: string
}

export default () => {
  const state = useState<PageState>('page-type-state', () => ({
    type: '',
    typeId: '',
  }))

  const setPageState = (key: keyof PageState, value: string) => {
    state.value[key] = value
  }

  const pageState = computed(() => state.value)

  return {
    setPageState,
    pageState,
  }
}
