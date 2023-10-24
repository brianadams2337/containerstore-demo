# SCAYLE Storefront Boilerplate - Nuxt 3 Migration Background Information

This documents should provide some foundational insights for a SCAYLE DemoShop (Nuxt 2)
to SCAYLE Storefront Boilerplate (Nuxt 3) migration.

- _Last updated: 19. October 2023_

[[TOC]]

## Why Nuxt 3

- **End of Life**: Vue 2 / Nuxt 2 reach their EOL at the end of this year (2023)
- **Knowledge**: Continue working with Vue / Nuxt ecosystem as it will be easier for all the developers to adapt
- **Time to Market**: Vue has an elegant learning curve for new developers and enables developers to pick up a project quickly
- **New Architecture**: Nuxt 3 represent not just a new iteration of the Nuxt framework, but takes the combined experiences and feedback collected from years of Nuxt.js 2 to unify everything into a newly redeveloped meta framework from the ground up
- TypeScript: Nuxt 3 is build from the ground up using TypeScript, resulting in improved developer experience and reduced overhead due to complications
- **Performance**: New underlying technologies and architecture allow for improvements in overall application response times and performance
- **Customizability**: Versatile possibilities to configure, tweak and adapt the application to desired needs
- **Extensibility**: Nuxt 3 continues the path of a modular architecture and fosters a large scale open-source ecosystem of modules and plugins to extend the default Nuxt 3 feature sets

## Architectural changes within Nuxt 3 framework

- **New Vue**: Nuxt 3 is built on top of Vue 3
- **New build toolchain**: Instead of Webpack 4, the default bundler is [Vite](https://vitejs.dev/) (Webpack 5 is also supported)
- **New HTTP framework**: Instead of `express`, middlewares and endpoints use [h3](https://github.com/unjs/h3)
- **New session library**: @scayle/h3-session instead of express-session
- **Standalone build**: No node_modules are included in the deployed application
- **Runtime env**: Runtime environment variables must be defined in runtimeConfig and follow the NUXT\_ format. All other env variables will be evaluated at compile time
- **Config limitations**: The configuration must be serializable and functions can no longer be passed as module options
- **No Vuex support**: There’s a built-in useState composable, or you can manually install vuex or pinia
- **Redevelopment**: Nuxt 3 is not a continuation of Nuxt.js 2, but a full redevelopment with different underlying technologies and architecture

## Changes from Nuxt 2 DemoShop to Nuxt 3 Storefront Boilerplate

- No Internet Explorer support anymore
- `vite` instead of `webpack` as a bundler tool.
- New modules (`nuxt-viewport`, `nuxt-svgo`, `nuxt-swiper`, etc )
- auto-imports (components, types etc)
- Vue 3 component generics
- Error handling
- Plugins order
- `useRpc` is now **async**, auto fetch is now enabled by default
- `utils` folder is replacement by auto imported `helpers`
- Component refactoring to ease long-term maintainability and usability
- Introducing global constants that can be used across the application
- `withParams` is now configurable through the storefront config
- And many more…

More information regarding all changes can be found as part of [Changes for Storefront Core](./02_changes-for-storefront-core.md)
and [Changes for DemoShop](./03_changes-for-demoshop.md).
