import { Category } from '@scayle/storefront-nuxt'

type SideNavigationState = {
  isOpen: boolean
  active: boolean
  selectedItem?: Category
}

export default () => {
  const state = reactive<SideNavigationState>({
    isOpen: false,
    selectedItem: undefined,
    active: false,
  })

  const isSideNavigationOpen = computed(() => state.isOpen)
  const isSideNavigationActive = computed(() => state.active)
  const selectedSideNavigationItem = computed(() => state.selectedItem)

  const selectSideNavigationItem = (item: Category) => {
    state.selectedItem = item

    if (item.depth > 3 || item.children?.length === 0) {
      state.isOpen = false
    }
  }

  const toggleSideNavigation = () => {
    state.isOpen = !state.isOpen
  }

  const closeSideNavigation = () => {
    state.isOpen = false
  }

  const openSideNavigation = () => {
    state.isOpen = true
  }

  const setSideNavigationActiveState = (value: boolean) => {
    state.active = value
  }

  return {
    isSideNavigationOpen,
    toggleSideNavigation,
    selectSideNavigationItem,
    selectedSideNavigationItem,
    closeSideNavigation,
    openSideNavigation,
    setSideNavigationActiveState,
    isSideNavigationActive,
  }
}
