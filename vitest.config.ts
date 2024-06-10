import { URL, fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // any custom vitest config you require
  test: {
    globals: true,
    include: ['**/*.test.?(c|m)[jt]s?(x)'],
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['text'],
    },
    environmentOptions: {
      nuxt: {
        overrides: {
          runtimeConfig: {
            public: {
              gtm: {
                id: 'GTM-123',
              },
            },
          },
        },
      },
    },
    clearMocks: true,
    onConsoleLog: (log) => {
      // Silence logs coming from vue <Suspense> is experimental, and stdout | unknown component before it
      if (log.includes('<Suspense')) {
        return false
      }
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
