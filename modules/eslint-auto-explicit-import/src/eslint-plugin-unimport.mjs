import { dirname, isAbsolute, relative } from 'pathe'
import { ESLintUtils } from '@typescript-eslint/utils'
import { analyze } from '@typescript-eslint/scope-manager'
import Debug from 'debug'

// Based on <https://github.com/antfu/eslint-plugin-unimport>

const version = '0.0.3'

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/antfu/eslint-plugin-unimport',
)

function betterRelative(from, to) {
  const r = relative(from, to).replace(/\.[\w]+/g, '')
  if (r.startsWith('../')) {
    return r
  }
  return `./${r}`
}

const debug = Debug('unimport:eslint')

function createImportsListeners(context, imports, onImportEntry) {
  let _scopeManager
  let _importsMap
  const importedNames = /* @__PURE__ */ new Set()

  function getScopeManager() {
    if (!_scopeManager) {
      _scopeManager = analyze(context.sourceCode.ast, {
        sourceType: 'module',
      })

      _scopeManager.globalScope?.variables.forEach((node) => {
        importedNames.add(node.name)
      })
    }

    return _scopeManager
  }

  function getImportsMap() {
    if (!_importsMap) {
      _importsMap = /* @__PURE__ */ new Map()
      imports.forEach((i) => {
        _importsMap.set(i.as || i.name, i)
      })
    }

    return _importsMap
  }
  function checkId(node) {
    if (typeof node.name !== 'string') {
      return
    }
    if (importedNames.has(node.name)) {
      return
    }

    const importsMap = getImportsMap()
    const item = importsMap.get(node.name)

    if (!item) {
      return
    }
    if (item.from === context.filename) {
      return
    }

    const scopeManager = getScopeManager()

    if (importedNames.has(node.name)) {
      return
    }

    let parent = node.parent
    let currentScope = null

    while (parent && !currentScope) {
      currentScope = scopeManager.acquire(parent)

      if (currentScope) {
        break
      }

      parent = parent.parent
    }

    if (!currentScope) {
      currentScope = scopeManager.globalScope
    }

    const visited = /* @__PURE__ */ new Set()

    while (true) {
      if (!currentScope || visited.has(currentScope)) {
        break
      }

      for (const ref of currentScope.variables) {
        if (ref.name === node.name) {
          return
        }
      }

      visited.add(currentScope)
      currentScope = currentScope.upper
    }

    importedNames.add(node.name)
    onImportEntry(node, item)
  }
  return {
    Identifier(node) {
      if (/Declaration|Specifier|Property/.test(node.parent.type)) {
        return
      }

      if (
        node.parent.type === 'MemberExpression' &&
        node.parent.object !== node
      ) {
        return
      }

      checkId(node)
    },
    ImportDeclaration(node) {
      node.specifiers.forEach((s) => {
        importedNames.add(s.local.name)
      })
    },
    'Program:exit': function () {
      const vueTemplate = context.sourceCode.ast.templateBody

      if (!vueTemplate) {
        return
      }

      function visit(node) {
        if (!node) {
          return
        }

        const expressionNode = node

        switch (expressionNode.type) {
          case 'Identifier':
            checkId(expressionNode)
            return
          case 'MemberExpression':
            visit(expressionNode.object)
            return
          case 'CallExpression':
            visit(expressionNode.callee)
            for (const arg of expressionNode.arguments) {
              visit(arg)
            }
            return
          case 'ConditionalExpression':
            visit(expressionNode.test)
            visit(expressionNode.consequent)
            visit(expressionNode.alternate)
            return
          case 'FunctionExpression':
          case 'ArrowFunctionExpression':
            for (const param of expressionNode.params) {
              visit(param)
            }
            visit(expressionNode.body)
            return
          case 'LogicalExpression':
          case 'BinaryExpression':
            visit(expressionNode.left)
            visit(expressionNode.right)
            return
        }

        switch (node.type) {
          case 'VText':
            return
          case 'VExpressionContainer':
            return visit(node.expression)
          case 'VElement':
            for (const attr of node.startTag.attributes) {
              visit(attr)
            }
            for (const child of node.children) {
              visit(child)
            }
            return
          case 'VAttribute':
            visit(node.value)
            return
        }

        if ('children' in node) {
          for (const child of node.children) {
            visit(child)
          }

          return
        }

        if ('body' in node) {
          visit(node.body)

          return
        }

        {
          // eslint-disable-next-line no-unused-vars
          const { tokens, parent, range, loc, ...rest } = node
          debug('Unknown VNode', rest)
        }
      }

      visit(vueTemplate)
    },
  }
}

const importPathDirNames = [
  '/node_modules/',
  '/packages/storefront-nuxt/',
  '/packages/omnichannel-nuxt/', // Package needs to export appropriate `#omnichannel/composables` alias first
]

const validDirNames = {
  storefrontNuxt: ['@scayle/storefront-nuxt', '/packages/storefront-nuxt'],
  omnichannelNuxt: ['@scayle/omnichannel-nuxt', '/packages/omnichannel-nuxt'],
}

// Mapping normalized import paths of packages to pure package imports
// to avoid "Nuxt Build Error: [vite:load-fallback] Could not load (...)" if
// path can not properly be resolved within package dist directory.
const importsMap = {
  'vue-i18n/dist/vue-i18n': 'vue-i18n',
  '@nuxtjs/i18n/dist/runtime/composables/index': '#i18n', // https://github.com/nuxt-modules/i18n/blob/main/package.json#L34C6-L34C11
  'nuxt/dist/pages/runtime/composables': '#imports', // Needs to be imported through #imports to properly work with TypeScript in the Nuxt context
  'nuxt-jsonld/dist/runtime/composable': '#imports', // Needs to be imported through #imports to properly work with TypeScript in the Nuxt context
  '@nuxt/image/dist/runtime/composables': '#imports', // Needs to be imported through #imports to properly work with TypeScript in the Nuxt context
}

const transformPathToImport = (itemFrom, dirName) => {
  const partialPath = itemFrom.split(dirName)[1]

  // We check if we're trying to import composables from `@scayle/storefront-nuxt`
  // or `@scayle/omnichannel-nuxt` and transform the import to their respective
  // allowed import path or alias.
  // NOTE: If a Nuxt project is part of a mono-repo setup and some of its used packages
  // are located within the root repo, the package resolution using `mlly` will not
  // resolve to a node_modules packages, but to the local package within the repository.
  // https://github.com/unjs/mlly/issues/158
  // For this reason we include a workaround that is able to check if we're within the
  // mono-repo setup and transform the import paths appropriately.
  if (
    validDirNames.storefrontNuxt.some((element) => itemFrom.includes(element))
  ) {
    return '#storefront/composables'
  }

  if (
    validDirNames.omnichannelNuxt.some((element) => itemFrom.includes(element))
  ) {
    return '#omnichannel/composables'
  }

  // `nuxt-module-builder@0.7.0` changed the file extension for files within
  // the build `/dist/runtime/` directory from `.mjs` to `.js`.
  // https://github.com/nuxt/module-builder/commit/dbd05bb
  const normalizedImportPath = partialPath.replace(/mjs|js/gi, '')

  return importsMap[normalizedImportPath] ?? normalizedImportPath
}

const createImportPaths = (item, context, srcAlias = '~') => {
  const relativePath = betterRelative(
    dirname(context.physicalFilename),
    item.from,
  )

  if (!isAbsolute(item.from)) {
    return item.from
  }

  // We're checking if the item.from path contains one of the relevant directory names
  // that we want to have transformed to a "plain" package import or alias import instead.
  const dirName = importPathDirNames.find((name) => relativePath.includes(name))

  if (dirName) {
    return transformPathToImport(relativePath, dirName)
  }

  return `${srcAlias}/${relativePath.replaceAll('../', '')}`
}

const autoInsert = createRule({
  name: 'auto-insert',
  meta: {
    type: 'problem',
    docs: {
      description: 'Auto insert missing imports from unimport registry',
    },
    messages: {
      missingImport: `Unimport entry '{{name}}' from '{{from}}' is not imported.`,
    },
    schema: [{ type: 'array', items: { type: 'any' } }],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return createImportsListeners(
      context,
      context.options[0] || [],
      (node, item) => {
        context.report({
          node,
          messageId: 'missingImport',
          data: {
            name: item.name,
            from: createImportPaths(item, context),
          },
          fix(fixer) {
            const resolvedFrom = createImportPaths(item, context)
            const body = context.sourceCode.ast.body
            const importName =
              item.name === '*'
                ? `* as ${item.as}`
                : item.name === 'default'
                ? item.as
                : !item.as || item.name === item.as
                ? `{ ${item.name} }`
                : `{ ${item.name} as ${item.as} }`

            return fixer.insertTextBefore(
              body[0],
              `import ${importName} from '${resolvedFrom}'
`,
            )
          },
        })
      },
    )
  },
})

const plugin = {
  meta: {
    name: 'unimport',
    version,
  },
  rules: {
    'auto-insert': autoInsert,
  },
}

function createAutoInsert(options) {
  return {
    name: 'unimport:auto-insert',
    plugins: {
      unimport: plugin,
    },
    files: options.include ?? [
      '**/*.ts',
      '**/*.(c|m)js',
      '**/*.(m|c)?tsx?',
      '**/*.vue',
    ],
    ignores: options.exclude ?? ['**/*.mdx?/**'],
    rules: {
      'unimport/auto-insert': ['error', options.imports],
    },
  }
}

export { createAutoInsert, plugin as default }
