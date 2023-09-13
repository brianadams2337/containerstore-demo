# SCAYLE Storefront Boilerplate - Nuxt 3 Migration

This document outlines all changes from the former Nuxt 2-based DemoShop to the new Nuxt 3-based Storefront Boilerplate.
Please keep in mind that this documentation is still being extended and will be regularly updated.

_Last updated: 11. September 2023_

[[TOC]]

## SVG Handling

With vite you can include svg icons by simply prefixing it with the `<Icon\* />` which is configured in the svgo config (default is `<Svgo\* />`.
Otherwise you need to import the svg explicitly and use it as a component.

One issue you might stumble on is using this module you can't size your icons as you might wish to with tailwind classes.
By default there is a prop `fontControlled` which you hve to disable like so: `<Icon* :fontControlled="false"/>`.
If the use-case is to have the flexibility of applying classes throughout the app then you need to make a change in the `nuxt.config`

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  svgo: {
    autoImportPath: './assets/icons',
    defaultImport: 'component', // this enables you to style things as you want: https://github.com/cpsoinos/nuxt-svgo/issues/122#issuecomment-1595264212
    componentPrefix: 'Icon', // Default is 'Svgo'
  },
})
```

## Cypress

There are a couple of points that are important to highlight when setting up Cypress.

- Now we use `BASE_URL` which comes from `.env`, and we also validate the url when setting up the Cypress config.
  Therefore, if you have not installed it beforehand, starting Cypress will not work.
- Cypress config is now written in TypeScript
- It is important to note that, since we are using `vite`, we need to set the following in the Cypress config:

```ts
module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'Vite',
    },
  },
})
```

The options above make sure that the bundler is `vite` and the framework that we're using is `vue`

## Vuelidate

The approach that we're using in Nuxt 3 is almost the same as it was in Nuxt 2.
When it comes to the rule message localization there is one thing to keep in mind.
In Nuxt 2, when defining the validation plugin, we accessed the global `i18n` instance within the context argument.
Now we need to access it via `useNuxtApp` composable.

```ts
export default defineNuxtPlugin(() => {
  const { $i18n } = useNuxtApp()
  // ...
})
```

Furthermore, we don't need to manually override the types as we did in Nuxt 2 with `Context` interface. Rule types will work now automatically.

## Toast

Toast plugin with its UI components remains almost the same.
The only thing that changed is that we need to use `refreshNuxtData` instead of `$nuxt.refresh()` within the `reload` toast action:

```ts
  onClick: () => Promise.resolve(refreshNuxtData()),
```

## Helpers/Utils

In Nuxt 2 we had `helpers` folder which exported some of the helper functions.
We also attached those helpers within the `useContext` so that we can access it through the components, composables etc.
Nuxt 3 recommends using [utils](https://nuxt.com/docs/guide/directory-structure/utils) folder.
Now we don't need to manually expose the helpers or import them explicitly because everything that exists under that folder will be auto-imported.

```ts
// utils/route.ts

type Link = 'home'

export type LinkList = Record<Link, { name: string; path: string }>

export const routeList: LinkList = {
  home: { name: 'index', path: '/' },
} as const

// In component usage
 <DefaultLink :to="{ name: routeList.home.name }" />
```

## Constants/types

One of the major change regarding the re-usable components are the usage of constants and types.
Now we introduced constants that are located under the `constants` folder which are representing TypeScript companion pattern approach (Exporting the same type and variable which TS smartly resolves it depends on the usage). This way we have everything encapsulated at one place and the advantage is flexibility and scalability
(e.g If we want to add one more Button type, we'll just add it on one place).

Example:

```ts
// constants/ui.ts

export const Size = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const

export type Size = ValuesType<typeof Size>

// Usage example:

import { Size } from '~/constants'

const props = defineProps({
  size: {
    type: String as PropType<Size>, // TS use it here as type
    default: Size.MD, // Regular object prop usage
    validator: (val: Size) => Object.values(Size).includes(val),
  },
})
```

## UI components

### Radio Input

In Nuxt 2 we had only one `Radio` component and we repeated it for each radio.
Now we introduced `RadioGroup` component, which has `RadioItem`s in it.
Now we just need to use radio group which will be v-modeled and pass `items` that are typed like this:

```ts
export type Item = { label: string; value: string }
```

- Usage:

```ts
 <RadioGroup v-model="gender" :items="genders" title="Gender" />
```

## Carousel Implementation: `vue-slick-carousel` replaced with `Swiper`

Previously for our slide show / carousel components we used vue-slick-carousel. We are now moving towards using `Swiper`.
Swiper is available as a nuxt module built on top of `swiper.js`.
There no need to create a custom plugin since the nuxt module is sufficient for our usage.

To migrate the following steps are needed:

### **Module Installation**

```sh
yarn add nuxt-swiper
```

### **Module Configuration**

Once installed you need to add this module to nuxt.config.ts and provide some configurations

```ts
import swiper from './config'
// nuxt.config.ts
modules: [
  ...,
    'nuxt-swiper',
  ],
...
swiper // configuration file below
```

### **Module Options**

We are using smaller configuration files to provide module options, but this can also be done within the nuxt.config.ts file is so preferred.
In this example I am taking the dedicated file into consideration.

```ts
// config/swiper.ts
export default {
  prefix: 'Swiper',
  modules: ['navigation', 'autoplay', 'pagination'],
}
```

The `Prefix` option can be used to provide a custom prefix and will change the module names from `Swiper[ModuleName]` to `MyPrefix[ModuleName]` for example:
`SwiperNavigation` would change to `MyPrefixNavigation` in the component usage.

The `modules` option can be used to configure what extra functionalities you want with your swiper instance.
A full list can be found [here](https://github.com/cpreston321/nuxt-swiper#usage).

### Usage

Once swiper has been correctly configured the components `<Swiper>` & `<SwiperSlide>` will be auto-imported and available for usage.
Your custom slide needs to be wrapped with the `<SwiperSlide>` component

```html
<template>
  <Swiper :modules="[...]" loop autoplay navigation>
    <SwiperSlide v-for="let slide in slides">
      <!-- Slide content here -->
    </SwiperSlide>
  </SwiperSlide>
</template>
```

### Lazy loading

An Important note here is the Lazy loading module is no longer supported.
Instead you can provide `<swiper-slide lazy=true>` and `<img loading="lazy" />` to lazy load images.

```html
<template>
  <Swiper>
    <SwiperSlide v-for="let slide in slides" lazy>
      <img src="source" loading="lazy" />
    </SwiperSlide>
  </SwiperSlide>
</template>
```

## `radash` enhanced with `nuxt-radash`

We are now enhancing the usage of radash by adding the
[nuxt-radash](https://github.com/bbg/nuxt-radash) that's recommended by the nuxt
community. It supports auto imports and it's easy to configure via nuxt config.
We stick with the `use` prefix as it is the default setting.

```ts
// plugins/validation.ts
// Usage:
...
    messagePath: ({ $validator }) => `validation.${useSnakeCase($validator)}`,
```

## Replace our custom `breakpoints` solution with the `nuxt-viewport` module

In Nuxt 3 we will use [nuxt-viewport](https://nuxt.com/modules/nuxt-viewport) which we use for the viewport/breakpoints handling.
We added the `./config/breakpoints.ts` file where we have all the breakpoints defined.
We use that for the `tailwind` and for the `nuxt-viewport` config so that we have those two in sync.
Current usage of the breakpoint handling is different which will be seen in the example bellow:

```vue
<template>
  <div v-if="viewport.isLessThan('sm')">Content</div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'

const viewport = useViewport()
// Other usage:
// const { $viewport } = useNuxtApp()
</script>
```

## Additions

### Packages

- [utility-types](https://www.npmjs.com/package/utility-types) - complex TypeScript types simplification utils
- [nuxt-lodash](https://github.com/cipami/nuxt-lodash#readme) - `lodash` nuxt module
- [nuxt-viewport](https://nuxt.com/modules/nuxt-viewport) - module for handling the breakpoints

### With parameters

Storefront config now supports `withParams` option so that we can pass the `with` parameters through the shop.
This allows to set them as default parameters within certain composables (e.g `useWishlist`).
This way we don't need an additional composable wrapper that we used in Nuxt 2 just to pass the with parameters.

```ts
export default defineNuxtConfig({
  storefront: {
    withParams,
  },
})
```

## CMS with Storyblok

### Module configuration

The module configuration for `@storyblok/nuxt` are identical to nuxt 2, you need to add it to the modules array and provide your storyblok access token in the module options.

```ts
import storyblok from './config'

  // nuxt.config.ts
  modules: [
    '@storyblok/nuxt',
  ],
  ...
  storyblok // configuration file below

  //config/storyblok.ts
  export default {
    accessToken: environment.STORYBLOK_ACCESS_TOKEN,
  },
```

### Auto-imported components

Storyblok components are auto imported. You need to create a `storyblok` directory at the root and the components will be made available.
Be mindful of component name collisions. If your component in the `~/components` director is named same as the one inside `~/storyblok` there can be issues with the storyblok auto-imported components.

The `StoryBlokComponent` is also auto-imported and can be used out of the box.

### useAsyncStoryblok composable

With this module the `useAsyncStoryblok` composable is also auto-imported and is enough to fetch content from storyblok.
You do not need a plugin or custom composables for the basic implementation.
If you'd need a plugin the guide can be found [here](https://github.com/storyblok/storyblok-nuxt#options).

With this composable you can provide `bridge` & `ApiOptions` in one place

```ts
const story = await useAsyncStoryblok(
  'vue',
  { version: 'draft', resolve_relations: 'Article.author' }, // API Options
  { resolveRelations: ['Article.author'], resolveLinks: 'url' }, // Bridge Options
)
```

_Minor Note_
For now the `useCms` composable is not needed but this might change as the migration is approaches completion.

## Route localization

In Nuxt 3 we introduced `toLocalePath` route utility which is a `useLocalePath` wrapper with some additional stuff.
The main difference being that we centralized the localization through the `DefaultLink` component and localized every route helper.
Through this change we don't need to repeat the localization process for each component or router action.

Unfortunately, this solution is not ideal because developer still has the responsibility to pay attention when managing the routing.
Now we need to take care to always use `DefaultLink` or route utils.
If there's some custom route that we need to use it, we'll need to manually use `toLocalePath` in order to have it working.
Furthermore, we also introduced `raw` property on `DefaultLink` component which is basically a replacement for the whole `RawLink` component that was used in Nuxt 2.

```ts
// Raw link (without any styles) usage
<DefaultLink :to="{ name: 'home' }" raw>Home</DefaultLink>

// Custom link localization usage
const router = useRouter()
const customRoute = '/some-custom-route'
await router.push(toLocalePath(customRoute))

// Router action with route utility usage
await router.push(getSearchRoute(searchQuery.value))
```

## HTTPS vs HTTP development mode

In Nuxt 2 we used the `https certificates` and we always used `https` mode for the `yarn dev`.
As part of Nuxt 3 we introduced two scripts so that we can run the app in http or https mode:

`yarn dev` and `yarn dev:https`

In order to have the `https` mode work properly we need to set env variables for key and cer file paths which will need to be generated the same as we did in Nuxt 2.

```text
HTTPS_KEY=
HTTPS_CERT=
```

## Intersection observer

- The same as in Nuxt 2 we introduced the `Intersect` component which handles
  and implements observer intersection. In the past we used our custom
  implementation with the native `IntersectionObserver` API. Now we use
  `useIntersectionObserver` composable that comes from `vueuse` and by doing that
  we simplified the solution a bit. One of the things that's worth mentioning is
  that now we expose `stop` function through the slot and event which can stop the
  intersection.

  ```vue
  <Intersect :threshold="0.5" @enter="onIntersect">
  // ...
  </Intersect>

  <script setup lang="ts">
  const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
    if (!props.blok.promotion_id) {
      return
    }
    stop()
  }
  </script>
  ```

</script>

```

```
