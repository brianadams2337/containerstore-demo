import { beforeEach, describe, it, expect, vi } from 'vitest'
import { computed, defineComponent, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { useCountryDetection } from './useCountryDetection'

const getTestComponentWrapper = (
  options: Parameters<typeof useCountryDetection>[0],
) => {
  return mount(
    defineComponent({
      template: '<div />',
      setup() {
        return {
          ...useCountryDetection(options),
        }
      },
    }),
  )
}
let isLoggedIn = false
const currentShop = ref({ locale: 'de-DE', shopId: 1 })
const availableShops = ref([
  { locale: 'de-DE', shopId: 1 },
  { locale: 'en-US', shopId: 2 },
])
vi.mock('#storefront/composables', () => ({
  useCurrentShop: () => currentShop,
  useAvailableShops: () => availableShops,
  useUser: () => ({
    isLoggedIn: computed(() => isLoggedIn),
  }),
}))

describe('useCountryDetection', () => {
  beforeEach(() => {
    isLoggedIn = false
    currentShop.value = { locale: 'de-DE', shopId: 1 }
    availableShops.value = [
      { locale: 'de-DE', shopId: 1 },
      { locale: 'en-US', shopId: 2 },
    ]
  })
  it('suggestionActive should be true for not logged in user with different locale that has never been prompted', async () => {
    const wrapper = getTestComponentWrapper({
      getDetectedCountryCode: () => 'US',
    })
    await flushPromises()
    expect(wrapper.vm.suggestionActive).toBe(true)
  })
  it('suggestionActive should be false for logged in user with different locale that has never been prompted', async () => {
    isLoggedIn = true
    const wrapper = getTestComponentWrapper({
      getDetectedCountryCode: () => 'US',
    })
    await flushPromises()
    expect(wrapper.vm.suggestionActive).toBe(false)
  })
  it('suggestionActive should be false for not logged in user with different locale that has been prompted before', async () => {
    const wrapper = getTestComponentWrapper({
      getDetectedCountryCode: () => 'US',
    })
    wrapper.vm.markUserAsPrompted()
    await flushPromises()
    expect(wrapper.vm.suggestionActive).toBe(false)
  })
  it('suggestionActive should be false for not logged in user with same locale that has never prompted before', async () => {
    const wrapper = getTestComponentWrapper({
      getDetectedCountryCode: () => 'DE',
    })
    await flushPromises()
    expect(wrapper.vm.suggestionActive).toBe(false)
  })

  it('suggestionActive should be false if no suggested shops are found', async () => {
    const wrapper = getTestComponentWrapper({
      getDetectedCountryCode: () => '',
    })
    await flushPromises()
    expect(wrapper.vm.suggestionActive).toBe(false)
  })

  it('should respect shouldPromptUser overwrite', async () => {
    const shouldPromptUser = vi.fn().mockReturnValue(false)
    const wrapper = getTestComponentWrapper({
      getDetectedCountryCode: () => 'US',
      shouldPromptUser,
    })
    await flushPromises()
    expect(wrapper.vm.suggestionActive).toBe(false)
    expect(shouldPromptUser).toHaveBeenCalledOnce()
  })
  it('should return detected region', async () => {
    const wrapper = getTestComponentWrapper({
      getDetectedCountryCode: () => 'US',
    })
    await flushPromises()
    expect(wrapper.vm.detectedRegion).toBe('US')
  })
  it('should return suggested shops', async () => {
    const wrapper = getTestComponentWrapper({
      getDetectedCountryCode: () => 'US',
    })
    await flushPromises()
    expect(wrapper.vm.suggestedShops).toStrictEqual([
      { locale: 'en-US', shopId: 2 },
    ])
  })
})
