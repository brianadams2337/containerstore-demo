import type { ModuleOptions } from '../types'

export function useCMSOptions() {
  const { cms } = useNuxtApp()
  return {
    provider: (cms as ModuleOptions).provider,
  }
}
