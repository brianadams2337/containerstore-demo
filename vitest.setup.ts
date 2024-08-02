import { vi } from 'vitest'

/**
 * This file is used for global mocks that should be executed before every test file.
 * Add mocks that are needed in multiple places to avoid code duplication.
 */

vi.mock('@scayle/storefront-nuxt', async () => {
  // Using 'importActual' here to just mock 'extendPromise' and not other function in the module.
  const actual = await vi.importActual('@scayle/storefront-nuxt')
  return {
    ...actual,
    extendPromise: vi.fn((_, values) => values),
  }
})
