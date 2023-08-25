#### SVG Handling

With vite you can include svg icons by simply prefixing it with the <Svgo\* />
otherwise you need to import the svg explicitly and use it as a component.

- On issue you might stumble on is using this module you can't size your icons
  as you might wish to with tailwind classes. By default there is a prop `fontControlled`
  which you hve to disable like so: `<Svgo* :fontControlled="false"/>`.
  If the use-case is to have the flexibility of applying classes throughout the
  app then you need to make a change in the `nuxt.config`

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  svgo: {
    autoImportPath: './assets/icons',
    defaultImport: 'component', // this enables you to style things as you want: https://github.com/cpsoinos/nuxt-svgo/issues/122#issuecomment-1595264212
  },
})
```

#### Cypress

There are a couple of points that are important to highlight when setting up cypress.

- Now we use `BASE_URL` which comes from `.env`, and we also validate the url when setting up the cypress config.
  Therefore, if you have not installed it beforehand, starting cypress will not work.
- Cypress config is now written in TypeScript
- It is important to note that, since we are using `Vite`, we need to set the following in the cypress config:

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

The options above make sure that the bundler is `Vite` and the framework that we're using is `vue`

### Vuelidate

- The approach that we're using in Nuxt 3 is almost the same as it was in Nuxt 2.
  When it comes to the rule message localization there is one thing to keep in mind.
  In Nuxt 2, when defining the validation plugin, we accessed the global `i18n`
  instance within the context argument. Now we need to access it via `useNuxtApp`
  composable.

```ts
export default defineNuxtPlugin(() => {
  const { $i18n } = useNuxtApp()
  // ...
})
```

- Furthermore, we don't need to manually override the types as we did in Nuxt 2
  with `Context` interface. Rule types will work now automatically.

## Toast

- Toast plugin with its UI components remains almost the same. The only thing that
  changed is that we need to use `refreshNuxtData` instead of `$nuxt.refresh()`
  within the `reload` toast action

```ts
  onClick: () => Promise.resolve(refreshNuxtData()),
```

### Constants/types

One of the major change regarding the re-usable compnents are the usage of constants and types.
Now we introduced constants that are located under the `constants` folder which are
representing TypeScript companion pattern approach (Exporting the same type and
variable which TS smartly resolves it depends on the usage). This way we have everything
encapsulated at one place and the advantage is flexibility and scalaibility.
(e.g If we want to add one more Button type, we'll just add it on one place)

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

import { Size } from '~/constants/ui'

const props = defineProps({
  size: {
    type: String as PropType<Size>, // TS use it here as type
    default: Size.MD, // Regular object prop usage
    validator: (val: Size) => Object.values(Size).includes(val),
  },
})
```

### UI components

## Radio Input

- In Nuxt 2 we had only one `Radio` component and we repeated it for each radio.
  Now we introduced `RadioGroup` component, which has `RadioItem`s in it. Now we
  just need to use radio group which will be v-modeled and pass `items` that are
  typed like this:

```ts
export type Item = { label: string; value: string }
```

- Usage:

```ts
 <RadioGroup v-model="gender" :items="genders" title="Gender" />
```

### Vue-slick-carousel replaced with Swiper

We are moving away from the vue-slick-carousel in favor of Swiper. Nuxt has a module for swiper which is easy to integrate and configure and supports SSR. All details related to configurations can be found at [Swiper Docs](https://nuxt.com/modules/swiper)

### Additions

#### Packages

- [utility-types](https://www.npmjs.com/package/utility-types) for complex
  TypeScript types simplification
