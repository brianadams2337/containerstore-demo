import { defineVitestConfig } from 'nuxt-vitest/config'

export default defineVitestConfig({
  // any custom vitest config you require
  test: {
    globals: true,
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['text'],
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
      '@': './',
      '~': './',
    },
  },
})
