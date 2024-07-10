import { expect, test } from '../../fixtures/fixtures'
import { runLighthouseAudit } from '../../support/lighthouseAudit'
import { lighthouseThresholds } from '../../support/constants'

test.describe.configure({ mode: 'serial', timeout: 120000 })

test('Lighthouse audit for PLP', async ({ baseURL }) => {
  const plpUrl = new URL('/frauen/bekleidung', baseURL)
  const averageScores = await runLighthouseAudit(plpUrl, 'plp')

  expect(averageScores.performance).toBeGreaterThanOrEqual(
    lighthouseThresholds.performance / 100,
  )
  expect(averageScores.accessibility).toBeGreaterThanOrEqual(
    lighthouseThresholds.accessibility / 100,
  )
  expect(averageScores.seo).toBeGreaterThanOrEqual(
    lighthouseThresholds.seo / 100,
  )
  expect(averageScores.bestPractices).toBeGreaterThanOrEqual(
    lighthouseThresholds.bestPractices / 100,
  )
})
