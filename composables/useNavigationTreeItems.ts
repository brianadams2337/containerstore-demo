import { type NavigationTree, extendPromise } from '@scayle/storefront-nuxt'

export function useNavigationTreeItems(prefix = 'base') {
  const navigatationTrees = useNavigationTrees({
    params: { params: { with: { category: true } } },
    key: `${prefix}-navigation-trees`,
  })

  const { data } = navigatationTrees

  const navigationTreeItems = computed<NavigationTree[]>(() => {
    const normalizedPrefix = prefix.toLowerCase()
    return (data.value ?? []).filter(({ name = '' }) => {
      return name.toLowerCase().startsWith(normalizedPrefix)
    })
  })

  return extendPromise(
    navigatationTrees.then(() => ({})),
    { navigationTreeItems },
  )
}
