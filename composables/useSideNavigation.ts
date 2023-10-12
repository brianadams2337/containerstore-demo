import { Category } from '@scayle/storefront-nuxt'

type SideNavigationState = {
  isOpen: boolean
  active: boolean
  selectedItem?: Category
}

export default () => {
  const state = useState<SideNavigationState>(() => ({
    isOpen: false,
    selectedItem: undefined,
    active: true,
  }))

  const isSideNavigationOpen = computed(() => state.value.isOpen)
  const isSideNavigationActive = computed(() => state.value.active)
  const selectedSideNavigationItem = computed(() => state.value.selectedItem)

  const selectSideNavigationItem = (item: Category) => {
    state.value.selectedItem = item

    if (item.depth > 3 || item.children?.length === 0) {
      state.value.isOpen = false
    }
  }

  const toggleSideNavigation = () => {
    state.value.isOpen = !state.value.isOpen
  }

  const closeSideNavigation = () => {
    state.value.isOpen = false
  }

  const openSideNavigation = () => {
    state.value.isOpen = true
  }

  const setSideNavigationActiveState = (value: boolean) => {
    state.value.active = value
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
