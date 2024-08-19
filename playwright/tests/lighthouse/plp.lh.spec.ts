import { expect, test } from '../../fixtures/fixtures'
import { runLighthouseAudit } from '../../support/lighthouseAudit'
import { LIGHTHOUSE_THRESHOLDS } from '../../support/constants'

test.describe.configure({ mode: 'serial', timeout: 120000 })

test('C2139575: Lighthouse audit for PLP', async ({ baseURL }) => {
  const plpUrl = new URL('/c/frauen/bekleidung-2048', baseURL)
  const averageScores = await runLighthouseAudit(plpUrl, 'plp')

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
