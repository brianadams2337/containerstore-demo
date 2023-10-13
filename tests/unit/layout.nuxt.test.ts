import { mountSuspended } from 'nuxt-vitest/utils'
import { describe, test, expect } from 'vitest'
import DefaultLayout from '@/layouts/default.vue'
describe('DefaultLayout', () => {
  test('is a Vue instance', async () => {
    const defaultLayout = await mountSuspended(DefaultLayout)
    expect(defaultLayout.html()).toMatchInlineSnapshot()
  })
})
