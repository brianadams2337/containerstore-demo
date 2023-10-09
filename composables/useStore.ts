type Store = {
  pageType: PageType
  pageTypeId: string
}

export default () =>
  useState<Store>('store', () => ({
    pageType: '',
    pageTypeId: '',
  }))
