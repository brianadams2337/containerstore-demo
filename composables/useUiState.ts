import {
  Category,
  NavigationItems,
  NavigationItemExternal,
} from '@scayle/storefront-nuxt'
import { FlyoutMenuCategory } from '~/types'

type NavigationItem = NavigationItems[0]

type UiState = Record<
  | 'sideNavigationOpen'
  | 'flyoutMenuOpen'
  | 'searchFlyout'
  | 'mobileSearchIsActive'
  | 'basketFlyout'
  | 'userFlyout'
  | 'modalOpen',
  boolean
> & {
  flyoutMenuCategory: FlyoutMenuCategory
  flyoutNavigationItem: NavigationItem
  selectedSideNavigationEntry?: Category
}

const DEFAULT_FLYOUT_NAVIGATION_ITEM: NavigationItemExternal = {
  id: 1,
  children: [],
  type: 'external',
  assets: {},
  languages: {},
  visibleFrom: null,
  visibleTo: null,
  options: {
    url: '',
    isOpenInNewWindows: false,
  },
}

const DEFAULT_FLYOUT_CATEGORY: FlyoutMenuCategory = {
  name: '',
  path: '',
  slug: '',
  id: 1,
  children: [],
}

const uiState = reactive<UiState>({
  sideNavigationOpen: false,
  flyoutMenuOpen: false,
  flyoutMenuCategory: DEFAULT_FLYOUT_CATEGORY,
  flyoutNavigationItem: DEFAULT_FLYOUT_NAVIGATION_ITEM,
  searchFlyout: false,
  mobileSearchIsActive: false,
  basketFlyout: false,
  userFlyout: false,
  selectedSideNavigationEntry: undefined,
  modalOpen: false,
})

export default () => {
  const isSideNavigationOpen = computed(() => uiState.sideNavigationOpen)
  const closeSideNavigation = () => {
    uiState.sideNavigationOpen = false
  }
  const openSideNavigation = () => {
    uiState.sideNavigationOpen = true
  }

  const toggleSideNavigation = () => {
    uiState.sideNavigationOpen = !uiState.sideNavigationOpen
  }

  const selectSideNavigationEntry = (entry: Category) => {
    uiState.selectedSideNavigationEntry = entry

    if (entry.depth > 3 || entry.children?.length === 0) {
      uiState.sideNavigationOpen = false
    }
  }

  const isFlyoutMenuOpen = computed(() => uiState.flyoutMenuOpen)
  const flyoutMenuCategory = computed(() => uiState.flyoutMenuCategory)
  const flyoutNavigationItem = computed(() => uiState.flyoutNavigationItem)

  const closeFlyoutMenu = (event: MouseEvent, force = false) => {
    const relatedTarget = event.relatedTarget as Element
    const shouldClose =
      ![
        'flyout-menu',
        'flyout-menu-items-container',
        'flyout-overscroll-container',
        'flyout-menu-items-container-content',
      ].includes(relatedTarget?.id) || force

    if (!shouldClose) {
      return
    }

    setTimeout(() => {
      uiState.flyoutMenuOpen = false
      uiState.flyoutMenuCategory = DEFAULT_FLYOUT_CATEGORY
      uiState.flyoutNavigationItem = DEFAULT_FLYOUT_NAVIGATION_ITEM
    }, 200)
  }
  const openFlyoutMenu = ({ children, name, path, slug, id }: Category) => {
    if (children?.length === 0) {
      uiState.flyoutMenuOpen = false
      return
    }

    uiState.flyoutMenuOpen = true
    uiState.flyoutMenuCategory = {
      name,
      path,
      slug,
      id,
      children: children || [],
    }
    uiState.flyoutNavigationItem = DEFAULT_FLYOUT_NAVIGATION_ITEM
  }

  const openFlyoutMenuForNavigationTree = (item: NavigationItem) => {
    uiState.flyoutNavigationItem = item
    uiState.flyoutMenuCategory = DEFAULT_FLYOUT_CATEGORY
    uiState.flyoutMenuOpen = true
  }

  const isSearchFlyoutOpen = computed(() => uiState.searchFlyout)

  const openSearchFlyout = () => {
    uiState.searchFlyout = true
  }

  const closeSearchFlyout = () => {
    uiState.searchFlyout = false
  }

  const openBasketFlyout = () => {
    uiState.basketFlyout = true
  }

  const closeBasketFlyout = () => {
    uiState.basketFlyout = false
  }

  const openUserFlyout = () => {
    uiState.userFlyout = true
  }

  const closeUserFlyout = () => {
    uiState.userFlyout = false
  }

  const setModalOpenState = (isOpen: boolean) => (uiState.modalOpen = isOpen)

  const mobileSearchIsActive = computed(() => uiState.mobileSearchIsActive)

  const setMobileSearchIsActive = (value: boolean) =>
    (uiState.mobileSearchIsActive = value)

  const selectedSideNavigationEntry = computed(
    () => uiState.selectedSideNavigationEntry,
  )

  const isBasketFlyoutOpen = computed(() => uiState.basketFlyout)
  const isUserFlyoutOpen = computed(() => uiState.userFlyout)

  const isModalOpen = computed(() => uiState.modalOpen)

  return {
    isSideNavigationOpen,
    closeSideNavigation,
    openSideNavigation,
    toggleSideNavigation,
    selectSideNavigationEntry,
    isFlyoutMenuOpen,
    flyoutMenuCategory,
    flyoutNavigationItem,
    closeFlyoutMenu,
    openFlyoutMenu,
    isSearchFlyoutOpen,
    closeSearchFlyout,
    openSearchFlyout,
    mobileSearchIsActive,
    setMobileSearchIsActive,
    selectedSideNavigationEntry,
    isBasketFlyoutOpen,
    isUserFlyoutOpen,
    openBasketFlyout,
    closeBasketFlyout,
    openUserFlyout,
    closeUserFlyout,
    openFlyoutMenuForNavigationTree,
    isModalOpen,
    setModalOpenState,
  }
}
