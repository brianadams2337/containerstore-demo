import { it, describe, vi } from 'vitest'
import { getCurrentCountryFromTimezone } from './currentCountry'

describe('currentCountryFromTimezone', () => {
  it('returns the correct country code for Berlin', ({ expect }) => {
    const Intl = {
      DateTimeFormat: vi.fn(() => ({
        resolvedOptions: vi.fn(() => ({
          timeZone: 'Europe/Berlin',
        })),
      })),
    }
    vi.stubGlobal('Intl', Intl)
    expect(getCurrentCountryFromTimezone()).toBe('DE')
  })

  it('returns the correct country code for New York', ({ expect }) => {
    const Intl = {
      DateTimeFormat: vi.fn(() => ({
        resolvedOptions: vi.fn(() => ({
          timeZone: 'America/New_York',
        })),
      })),
    }
    vi.stubGlobal('Intl', Intl)
    expect(getCurrentCountryFromTimezone()).toBe('US')
  })

  it('returns the correct country code for Bratislava', ({ expect }) => {
    const Intl = {
      DateTimeFormat: vi.fn(() => ({
        resolvedOptions: vi.fn(() => ({
          timeZone: 'Europe/Bratislava',
        })),
      })),
    }
    vi.stubGlobal('Intl', Intl)
    expect(getCurrentCountryFromTimezone()).toBe('SK')
  })

  it('returns the correct country code for Slovakia', ({ expect }) => {
    const Intl = {
      DateTimeFormat: vi.fn(() => ({
        resolvedOptions: vi.fn(() => ({
          timeZone: 'Europe/Prague',
        })),
      })),
    }
    const navigator = {
      language: 'sk-SK',
    }
    vi.stubGlobal('Intl', Intl)
    vi.stubGlobal('navigator', navigator)
    expect(getCurrentCountryFromTimezone()).toBe('SK')
  })

  it('returns the correct country code for Czechia', ({ expect }) => {
    const Intl = {
      DateTimeFormat: vi.fn(() => ({
        resolvedOptions: vi.fn(() => ({
          timeZone: 'Europe/Prague',
        })),
      })),
    }
    const navigator = {
      language: 'cs-CZ',
    }
    vi.stubGlobal('Intl', Intl)
    vi.stubGlobal('navigator', navigator)
    expect(getCurrentCountryFromTimezone()).toBe('CZ')
  })

  it('returns undefined for an unknown timezone', ({ expect }) => {
    const Intl = {
      DateTimeFormat: vi.fn(() => ({
        resolvedOptions: vi.fn(() => ({
          timeZone: undefined,
        })),
      })),
    }
    vi.stubGlobal('Intl', Intl)
    expect(getCurrentCountryFromTimezone()).toBe(undefined)
  })
})
