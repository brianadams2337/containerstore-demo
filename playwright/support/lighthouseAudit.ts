import fs from 'node:fs'
import lighthouse from 'lighthouse/core/index.cjs'
import { chromium } from 'playwright'
import type { OutputMode } from '../fixtures/fixtures'

const NUM_RUNS = 3

export const runLighthouseAudit = async (url: URL, auditedPage: string) => {
  const scores: {
    performance: number[]
    accessibility: number[]
    seo: number[]
    bestPractices: number[]
  } = {
    performance: [],
    accessibility: [],
    seo: [],
    bestPractices: [],
  }

  for (let i = 0; i < NUM_RUNS; i++) {
    const browser = await chromium.launch({
      headless: true,
      args: ['--remote-debugging-port=9015'],
    })

    try {
      const lhOptions = {
        port: 9015,
        output: ['json', 'html'] as OutputMode[],
        chromeFlags: ['--incognito'],
        extraHeaders: {
          'x-vercel-protection-bypass':
            process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? '',
          'x-vercel-set-bypass-cookie': 'true',
        },
      }

      const fullAuditUrl = new URL(url)
      fullAuditUrl.searchParams.append(
        'x-vercel-protection-bypass',
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
      )
      fullAuditUrl.searchParams.append('x-vercel-set-bypass-cookie', 'true')

      const config = {
        extends: 'lighthouse:default',
      }

      const runnerResult = await lighthouse(
        `${fullAuditUrl}`,
        lhOptions,
        config,
      )

      if (i === 0) {
        try {
          const filename = `./lighthouse-reports/lighthouse-report-${auditedPage}.json`

          const cleanedResult = JSON.parse(JSON.stringify(runnerResult))
          delete cleanedResult.artifacts

          fs.writeFileSync(filename, JSON.stringify(cleanedResult, null, 2))
        } catch (err) {
          console.error('Error saving Lighthouse report:', err)
        }
      }

      if (runnerResult && runnerResult.lhr) {
        scores.performance.push(
          runnerResult.lhr.categories.performance.score as number,
        )
        scores.accessibility.push(
          runnerResult.lhr.categories.accessibility.score as number,
        )
        scores.seo.push(runnerResult.lhr.categories.seo.score as number)
        scores.bestPractices.push(
          runnerResult.lhr.categories['best-practices'].score as number,
        )
      } else {
        console.error(
          'Lighthouse audit failed or did not return a valid result.',
        )
        throw new Error('Lighthouse audit failed')
      }
    } catch (error) {
      console.error('Error running Lighthouse audit:', error)
      throw error
    } finally {
      await browser.close()
    }
  }

  return {
    performance: calculateAverage(scores.performance),
    accessibility: calculateAverage(scores.accessibility),
    seo: calculateAverage(scores.seo),
    bestPractices: calculateAverage(scores.bestPractices),
  }
}

function calculateAverage(scores: number[]): number {
  if (scores.length === 0) {
    return 0
  }

  const sum = scores.reduce((a, b) => a + b, 0)

  return sum / scores.length
}
