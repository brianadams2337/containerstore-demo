import type {
  Category,
  NavigationItemExternal,
  NavigationItems,
} from '@scayle/storefront-nuxt'

export type FlyoutMenuCategory = {
  name: string
  path: string
  slug: string
  id: number
  children: Category[]
}

type NavigationItem = NavigationItems[0]

type FlyoutsState = Record<
  'flyoutMenuOpen' | 'searchFlyout' | 'basketFlyout' | 'userFlyout',
  boolean
> & {
  flyoutMenuCategory: FlyoutMenuCategory
  flyoutNavigationItem: NavigationItem
}

const DEFAULT_FLYOUT_NAVIGATION_ITEM: NavigationItemExternal = {
  id: 1,
  children: [],
  name: '',
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
  id: 1,
  name: '',
  path: '',
  slug: '',
  children: [],
}

export function useFlyouts() {
  const state = useState<FlyoutsState>('use-flyouts-state', () => ({
    flyoutMenuOpen: false,
    flyoutMenuCategory: DEFAULT_FLYOUT_CATEGORY,
    flyoutNavigationItem: DEFAULT_FLYOUT_NAVIGATION_ITEM,
    searchFlyout: false,
    basketFlyout: false,
    userFlyout: false,
  }))

  const isFlyoutMenuOpen = computed(() => state.value.flyoutMenuOpen)
  const flyoutMenuCategory = computed(() => state.value.flyoutMenuCategory)
  const flyoutNavigationItem = computed(() => state.value.flyoutNavigationItem)
  const isBasketFlyoutOpen = computed(() => state.value.basketFlyout)
  const isUserFlyoutOpen = computed(() => state.value.userFlyout)
  const isSearchFlyoutOpen = computed(() => state.value.searchFlyout)

  let closeFlyoutTimeout: NodeJS.Timeout

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

    closeFlyoutTimeout = setTimeout(() => {
      state.value.flyoutMenuOpen = false
      state.value.flyoutMenuCategory = DEFAULT_FLYOUT_CATEGORY
      state.value.flyoutNavigationItem = DEFAULT_FLYOUT_NAVIGATION_ITEM
    }, 200)
  }
  const openFlyoutMenu = ({ children, name, path, slug, id }: Category) => {
    if (children?.length === 0) {
      state.value.flyoutMenuOpen = false
      return
    }
    if (closeFlyoutTimeout) {
      clearTimeout(closeFlyoutTimeout)
    }

    state.value.flyoutMenuOpen = true
    state.value.flyoutMenuCategory = {
      name,
      path,
      slug,
      id,
      children: children || [],
    }
    state.value.flyoutNavigationItem = DEFAULT_FLYOUT_NAVIGATION_ITEM
  }

  const openFlyoutMenuForNavigationTree = (item: NavigationItem) => {
    state.value.flyoutNavigationItem = item
    state.value.flyoutMenuCategory = DEFAULT_FLYOUT_CATEGORY
    state.value.flyoutMenuOpen = true
  }

  const openSearchFlyout = () => {
    state.value.searchFlyout = true
  }

  const closeSearchFlyout = () => {
    state.value.searchFlyout = false
  }

  const openBasketFlyout = () => {
    state.value.basketFlyout = true
  }

  const closeBasketFlyout = () => {
    state.value.basketFlyout = false
  }

  const openUserFlyout = () => {
    state.value.userFlyout = true
  }

  const closeUserFlyout = () => {
    state.value.userFlyout = false
  }

  return {
    isFlyoutMenuOpen,
    flyoutMenuCategory,
    flyoutNavigationItem,
    closeFlyoutMenu,
    openFlyoutMenu,
    isSearchFlyoutOpen,
    closeSearchFlyout,
    openSearchFlyout,
    isBasketFlyoutOpen,
    isUserFlyoutOpen,
    openBasketFlyout,
    closeBasketFlyout,
    openUserFlyout,
    closeUserFlyout,
    openFlyoutMenuForNavigationTree,
  }
}
