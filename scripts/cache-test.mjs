import http from 'node:http'
import test from 'node:test'
import assert from 'node:assert/strict'
import { join } from 'node:path'

// Quick test script for validating that routeRules are properly
// set for caching the public pages, and not caching private ones
// Can be run like `node scripts/cache-test.mjs`
// The BASE_URL can be set via an environment variable
// Otherwise, it will default to testing http://localhost:3000/en

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000/en'

const getHeaders = async (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      resolve(res.headers)
    }).on('error', (e) => reject(e))
  })
}

function parseCacheControl(header) {
  const result = {}
  const directives = header.split(',').map(d => d.trim())

  directives.forEach(directive => {
    if (directive.includes('=')) {
      const [property, value] = directive.split('=')
      result[property.trim()] = value.trim()
    } else {
      result[directive] = true
    }
  })

  return result
}

function assertCacheHeaders(headers) {
  try {
    if (!headers['cache-control']) {
      assert.fail('Cache headers are missing!')
    }

    const cacheControl = parseCacheControl(headers['cache-control'])

    if (isNaN(parseInt(cacheControl['s-maxage']))) {
      assert.fail('Missing s-maxage directive in cache-control header')
    }

    if (cacheControl['stale-while-revalidate'] !== 'true' && isNaN(parseInt(cacheControl['stale-while-revalidate']))) {
      assert.fail('Missing stale-while-revalidate directive in cache-control header')
    }
  } catch (e) {
    console.error(headers)
    throw e
  }
}

function assertNoCacheHeaders(headers) {
  if (headers['cache-control']) {
    console.error({ headers })
    assert.fail('Cache headers should not be present!')
  }
}

test('home page has cache headers', async () => {
  const headers = await getHeaders(BASE_URL)
  assertCacheHeaders(headers)
})

test('product list has cache headers', async () => {
  const headers = await getHeaders(join(BASE_URL, '/women'))
  assertCacheHeaders(headers)
})

test('product list has cache headers', async () => {
  const headers = await getHeaders(join(BASE_URL, '/women'))
  assertCacheHeaders(headers)
})

test('product page has cache headers', async () => {
  const headers = await getHeaders(join(BASE_URL, '/p/ribbed-tank-top-with-10-images-and-2-color-variations-1078'))
  assertCacheHeaders(headers)
})

test('wishlist does not have cache headers', async () => {
  const headers = await getHeaders(join(BASE_URL, '/wishlist'))
  assertNoCacheHeaders(headers)
})

test('basket does not have cache headers', async () => {
  const headers = await getHeaders(join(BASE_URL, '/wishlist'))
  assertNoCacheHeaders(headers)
})
