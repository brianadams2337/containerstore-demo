import type { NavigationTree } from '@scayle/storefront-nuxt'

export const filterNavigationTree = (
  treeItems: NavigationTree[],
  prefixToMatch = '',
): NavigationTree[] => {
  const normalizedPrefix = prefixToMatch.toLowerCase()
  return treeItems.filter(({ name }) => {
    return name?.toLowerCase().startsWith(normalizedPrefix)
  })
}
