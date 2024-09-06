import type { Page } from 'playwright-core'
import { expect } from '../fixtures/fixtures'

export const isMobile = (page: Page) => {
  const viewportSize = page.viewportSize()
  return viewportSize && viewportSize.width < 768
}

export async function getAllLinksFromPage(page: Page) {
  const link = page.getByRole('link')
  const allLinks = await link.all()
  const allLinkHrefs = await Promise.all(
    allLinks.map((link) => link.getAttribute('href')),
  )
  return allLinkHrefs.reduce((links, link) => {
    expect(link, 'link has no a proper href').not.toBeFalsy()

    if (link && !link?.startsWith('mailto:') && !link?.startsWith('#'))
      links.add(new URL(link, page.url()).href)
    return links
  }, new Set<string>())
}
