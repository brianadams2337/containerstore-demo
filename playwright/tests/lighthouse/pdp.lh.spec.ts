import { expect, test } from '../../fixtures/fixtures'
import { runLighthouseAudit } from '../../support/lighthouseAudit'
import { LIGHTHOUSE_THRESHOLDS } from '../../support/constants'

test.describe.configure({ mode: 'serial', timeout: 120000 })

test('C2139576: Lighthouse audit for PDP', async ({ baseURL }) => {
  const pdpUrl = new URL('/p/sweater-ida-1193', baseURL)

  const averageScores = await runLighthouseAudit(pdpUrl, 'pdp')

  expect(averageScores.performance).toBeGreaterThanOrEqual(
    LIGHTHOUSE_THRESHOLDS.performance / 100,
  )
  expect(averageScores.accessibility).toBeGreaterThanOrEqual(
    LIGHTHOUSE_THRESHOLDS.accessibility / 100,
  )
  expect(averageScores.seo).toBeGreaterThanOrEqual(
    LIGHTHOUSE_THRESHOLDS.seo / 100,
  )
  expect(averageScores.bestPractices).toBeGreaterThanOrEqual(
    LIGHTHOUSE_THRESHOLDS.bestPractices / 100,
  )
})
