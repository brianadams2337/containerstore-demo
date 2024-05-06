import { getRequestURL } from 'h3'
import { trace, type Span, SpanStatusCode } from '@opentelemetry/api'
import {
  SEMATTRS_HTTP_HOST,
  SEMATTRS_HTTP_METHOD,
  SEMATTRS_HTTP_ROUTE,
} from '@opentelemetry/semantic-conventions'

const tracer = trace.getTracer(
  'nitro',
  // TODO: Add package version, once we have a separate package
)

function getFilter(pathBlocklist?: string): (path: string) => boolean {
  if (!pathBlocklist) {
    return (_path: string) => true
  }

  try {
    const regex = new RegExp(pathBlocklist)
    return (path: string) => regex.test(path)
  } catch {
    return (path: string) => path.includes(pathBlocklist)
  }
}

export default defineNitroPlugin((nitro) => {
  const config = useRuntimeConfig().opentelemetry

  // Find the h3 handler which is the nitro router
  const index = nitro.h3App.stack.findIndex(
    (layer) => layer.handler.__resolve__,
  )
  const router = nitro.h3App.stack[index]

  if (!router) {
    console.warn('Unable to find router handler')
    return
  }

  if (!config.enabled) {
    return
  }

  const filter = getFilter(config.pathBlocklist)

  // Wrap the nitro router with code which adds a span
  nitro.h3App.stack.splice(index, 1, {
    ...router,
    handler: async (event) => {
      const url = getRequestURL(event)

      if (filter(url.pathname)) {
        return await router?.handler(event)
      }

      return await tracer.startActiveSpan(
        `${event.method} ${event.path}`,
        {
          attributes: {
            [SEMATTRS_HTTP_HOST]: url.host,
            [SEMATTRS_HTTP_METHOD]: event.method,
            'url.full': url.toString(),
            'url.path': url.pathname,
            'url.query': url.search,
            'url.scheme': url.protocol,
          },
        },
        async (span: Span) => {
          let result
          try {
            result = await router?.handler(event)
          } catch (e) {
            if (e instanceof Error) {
              span.recordException(e)
            }
            span.setStatus({ code: SpanStatusCode.ERROR })
          }

          // The matchedRoute exists after the handler has run
          const matchedRoute = event.context.matchedRoute?.path
          const matchedVueRoute = event.context.matchedVueRoute?.path

          if (matchedRoute) {
            if (matchedRoute === '/**' && matchedVueRoute) {
              span.updateName(`${event.method} ${matchedVueRoute}`)
              span.setAttribute(SEMATTRS_HTTP_ROUTE, matchedVueRoute)
            } else {
              span.updateName(`${event.method} ${matchedRoute}`)
              span.setAttribute(SEMATTRS_HTTP_ROUTE, matchedRoute)
            }
          }

          span.end()

          return result
        },
      )
    },
  })
})
