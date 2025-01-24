import { expect, it } from 'vitest'
import type { NavigationTreeItem } from '@scayle/storefront-nuxt'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import {
  navigationItemCategoryFactory,
  navigationItemExternalFactory,
} from '@scayle/storefront-nuxt/dist/test/factories'
import { isNavigationItemCategoryActive } from './category'

const navigationItem: NavigationTreeItem = navigationItemCategoryFactory.build({
  categoryId: 1,
  id: 1,
  children: [
    navigationItemCategoryFactory.build({
      categoryId: 2,
      id: 1,
      children: [
        navigationItemCategoryFactory.build({
          categoryId: 3,
          id: 1,
          children: [
            navigationItemCategoryFactory.build({
              categoryId: 4,
              id: 1,
            }),
          ],
        }),
      ],
    }),
  ],
})

it.each([
  ['1', true],
  ['2', true],
  ['3', true],
  ['4', true],
])('should work with %s levels', (level, result) => {
  const isActive = isNavigationItemCategoryActive(
    navigationItem,
    'category_page',
    {
      params: {
        id: level,
      },
    } as unknown as RouteLocationNormalizedLoadedGeneric,
  )
  expect(isActive).toBe(result)
})

it('should return false when the page type is not "category_page"', () => {
  const isActive = isNavigationItemCategoryActive(navigationItem, 'page', {
    params: {
      id: '1',
    },
  } as unknown as RouteLocationNormalizedLoadedGeneric)
  expect(isActive).toBe(false)
})

it('should return false when the navigation item is not of type "category"', () => {
  const isActive = isNavigationItemCategoryActive(
    navigationItemExternalFactory.build({ id: 1 }),
    'category_page',
    {
      params: {
        id: '1',
      },
    } as unknown as RouteLocationNormalizedLoadedGeneric,
  )
  expect(isActive).toBe(false)
})
