import type { Page } from 'playwright-core'
import { expect } from '@playwright/test'
import { TEST_USERS } from './constants'

import { BREAKPOINTS } from '../../config/ui'

interface SeoOptions {
  title?: string
  description?: string
  robots?: string
  canonical?: string
}

/**
 * Determines if the current page is using a mobile viewport based on the configured breakpoint.
 * Returns true if the viewport width is less than BREAKPOINTS.md, false otherwise.
 *
 * @param page - The Playwright Page object
 * @returns boolean indicating if the viewport is mobile
 */
export const isMobile = (page: Page): boolean => {
  const viewportSize = page.viewportSize()

  return !!viewportSize && viewportSize.width < BREAKPOINTS.md
}

/**
 * Extracts all unique, absolute, non-mailto, non-hash links from the page.
 * Uses a single browser context operation for performance, leveraging Playwright's `locator.evaluateAll` for robustness.
 *
 * @param page - The Playwright Page object
 * @returns A Set of absolute URLs as strings
 */
export async function getAllLinksFromPage(page: Page): Promise<Set<string>> {
  const links = new Set<string>()
  const pageUrl = page.url()
  // Extract all hrefs from anchor tags using locator.evaluateAll for robustness
  const hrefs = await page
    .locator('a')
    .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')))

  for (const link of hrefs) {
    // Warn if href is missing
    expect.soft(link, 'link is missing href attribute').not.toBeFalsy()

    // Filter out mailto and hash links, and ensure link is not null/empty
    if (
      link &&
      !link.startsWith('mailto:') &&
      !link.startsWith('#') &&
      link.trim() !== ''
    ) {
      // Convert to absolute URL
      links.add(new URL(link, pageUrl).href)
    }
  }
  return links
}

/**
 * Returns test user e-mail address and password.
 * To avoid conflicts in parallel test execution, each browser has dedicated test user.
 * Test user email and password keys are stored in constant object `USER_ACCOUNT` within `/playwright/support/constants.ts`.
 * Their values should be defined via environment variables.
 */
export const getUserForBrowser = (
  browserName: string,
): { email: string; password: string } => {
  const browserUserMap: Record<string, string> = {
    /** Should be defined via environment variable `TEST_USER_EMAIL1` */
    chromium: 'testUserEmail1',
    /** Should be defined via environment variable `TEST_USER_EMAIL2` */
    firefox: 'testUserEmail2',
    /** Should be defined via environment variable `TEST_USER_EMAIL3` */
    webkit: 'testUserEmail3',
    /** Should be defined via environment variable `TEST_USER_EMAIL4` */
    'mobile-chrome': 'testUserEmail4',
    /** Should be defined via environment variable `TEST_USER_EMAIL5` */
    'mobile-safari': 'testUserEmail5',
    /** Default fallback is testUserEmail1, but it is strongly recommended to define dedicated test user for every browser. */
    default: 'testUserEmail1',
  }

  const userEmailKey = browserUserMap[browserName] || browserUserMap.default

  return {
    email: TEST_USERS[userEmailKey as keyof typeof TEST_USERS],
    /** Password should be defined via environment variable TEST_USER_PASSWORD */
    password: TEST_USERS.testUserPassword,
  }
}

/**
 * Verifies various SEO (Search Engine Optimization) meta tags and attributes on a given page.
 * This function checks for the presence and correctness of the page title, meta description,
 * robots tag, and canonical link based on the provided options.
 *
 * @param page - The Playwright Page object representing the current web page.
 * @param options - An object containing the SEO properties to verify.
 * Only properties explicitly defined in this object will be checked.
 */
export async function verifySeoMetaTags(page: Page, options: SeoOptions) {
  if (options.title) {
    await expect(page).toHaveTitle(options.title)
  }

  if (options.description) {
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      options.description,
    )
  }

  if (options.robots) {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      options.robots,
    )
  }

  if (options.canonical) {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      options.canonical,
    )
  }
}

/**
 * Cleans a navigation item label by removing all digits and trimming whitespace.
 * This is typically used to extract the pure category name from a label that
 * might include a product counter (e.g., "Dresses 123" becomes "Dresses").
 *
 * @param stringValue - The raw string value of the navigation item label.
 * @returns The cleaned string value without digits and leading/trailing whitespace.
 */
export const navigationItemLabel = (stringValue: string) =>
  stringValue.replace(/\d/g, '').trim()

/**
 * Formats an active category breadcrumb label into a URL-friendly segment.
 * It converts the string to lowercase and replaces a trailing product counter
 * (e.g., " 123") with a hyphen "-".
 * Example: "Bekleidung 123" becomes "bekleidung-"
 *
 * @param activeCategoryText - The text content of the active category breadcrumb.
 * @returns The URL-formatted string.
 */
export const formatCategoryUrlSegment = (activeCategoryText: string | null) => {
  const lowercasedText = activeCategoryText?.toLowerCase() ?? ''
  return lowercasedText.replace(/ \d+$/, '-')
}

/**
 * Retrieves a required environment variable, throwing an error if it is not set.
 * @param key The name of the environment variable.
 * @returns The value of the environment variable (guaranteed string).
 * @throws {Error} If the environment variable is not set.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key]

  if (value === undefined) {
    throw new Error(
      `Environment variable '${key}' is required but not set. Please check your .env file or CI/CD configuration.`,
    )
  }

  return value
}
