import { describe, it, expect } from 'vitest'

describe('showDividerTag', () => {
  it('should return "true" for first item in the array', () => {
    const isDivierTagShown = showDividerTag(0, 4)

    expect(isDivierTagShown).toEqual(true)
  })

  it('should return "false" for last item in the array', () => {
    const isDivierTagShown = showDividerTag(4, 4)

    expect(isDivierTagShown).toEqual(false)
  })
})
