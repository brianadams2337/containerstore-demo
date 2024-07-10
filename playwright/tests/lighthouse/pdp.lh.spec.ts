import { expect, test } from '../../fixtures/fixtures'
import { runLighthouseAudit } from '../../support/lighthouseAudit'
import { lighthouseThresholds } from '../../support/constants'

test.describe.configure({ mode: 'serial' })

test('Lighthouse audit for PLP', async ({ baseURL }) => {
  const averageScores = await runLighthouseAudit(
    `${baseURL}/p/adele-gerafftes-midikleid-1145`,
  )

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
