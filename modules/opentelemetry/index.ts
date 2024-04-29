import { createResolver, defineNuxtModule } from '@nuxt/kit'
import { genImport } from 'knitwork'

function getInstrumentedEntryFileForPreset(
  preset: string,
  instrumentationFile: string,
  baseEntry: string,
) {
  let entryFile

  if (preset === 'node-server') {
    entryFile = `
import { register, createRequire } from 'node:module';
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
register(pathToFileURL(require.resolve("./node-hooks.mjs")))

// We should use dynamic imports after registering the customization hooks
// https://nodejs.org/api/module.html#customization-hooks

// First load the instrumentation file which initialized the OTEL SDK
import("${instrumentationFile}")

// Then load our application's entry point
import("${baseEntry}")`
  } else if (preset.includes('vercel')) {
    entryFile = `
  ${genImport(instrumentationFile)}
  ${genImport(baseEntry, 'handler')}
  export default handler
  `
  }

  return entryFile
}

type ModuleOptions = {
  enabled: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/nuxt-opentelemetry',
    configKey: 'opentelemetry',
    version: '0.1.0',
    compatibility: {
      bridge: false,
      nuxt: '>=3.10',
    },
  },
  defaults: {
    enabled: false,
  },
  setup(options, nuxt) {
    if (!options.enabled) {
      return
    }
    const resolver = createResolver(import.meta.url)

    nuxt.hooks.hook('nitro:init', (nitro) => {
      const { entry, preset } = nitro.options

      let instrumentationFile

      if (preset === 'node-server') {
        instrumentationFile = resolver.resolve('src/node')
      } else if (preset.includes('vercel')) {
        instrumentationFile = resolver.resolve('src/vercel')
      } else {
        return
      }

      // Add the entry to moduleSideEffects so we don't treeshake away our server!
      nitro.options.moduleSideEffects.push(entry, instrumentationFile)

      const newEntry = getInstrumentedEntryFileForPreset(
        preset,
        instrumentationFile,
        entry,
      )

      if (newEntry) {
        nitro.options.virtual['#virtual/instrumented-entry'] = newEntry
        nitro.options.entry = '#virtual/instrumented-entry'
      }

      // For the node preset, we need to add module customization hooks
      if (preset === 'node-server') {
        nitro.hooks.hook('rollup:before', (_nitro, rollupConfig) => {
          if (typeof rollupConfig.input === 'string') {
            rollupConfig.input = [
              rollupConfig.input,
              resolver.resolve('src/node-hooks'),
            ]
          }
          rollupConfig.output.entryFileNames = function (info) {
            if (info.name === 'node-hooks') {
              return 'node-hooks.mjs'
            }
            return 'index.mjs'
          }
        })
      }
    })
  },
})
