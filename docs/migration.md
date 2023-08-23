#### SVG Handling

With vite you can include svg icons by simply prefixing it with the <Svgo\* /> otherwise you need to import the svg explicitly and use it as a component

- On issue you might stumble on is using this module you can't size your icons as you might wish to with tailwind classes. By default there is a prop `fontControlled` which you hve to disable like so: `<Svgo* :fontControlled="false"/>`. If the use-case is to have the flexibility of applying classes throughout the app then you need to make a change in the `nuxt.config`

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

The approach that we're using in Nuxt 3 is almost the same as it was in Nuxt 2.
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
