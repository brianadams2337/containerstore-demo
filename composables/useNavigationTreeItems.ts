import type { NavigationTree } from '@scayle/storefront-nuxt'

export async function useNavigationTreeItems(prefix = 'base') {
  const { data } = await useNavigationTrees({
    params: { params: { with: { category: true } } },
    key: `${prefix}-navigation-trees`,
  })

  const navigationTreeItems = computed<NavigationTree[]>(() => {
    const normalizedPrefix = prefix.toLowerCase()
    return (data.value ?? []).filter(({ name = '' }) => {
      return name.toLowerCase().startsWith(normalizedPrefix)
    })
  })

  return { navigationTreeItems }
}
