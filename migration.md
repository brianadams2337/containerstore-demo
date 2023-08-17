#### SVG Handling

With vite you can include svg icons by simply prefixing it with the <Svgo\* /> otherwise you need to import the svg explicitly and use it as a component

- On issue you might stumble on is using this module you can't size your icons as you might wish to with tailwind classes. By default there is a prop `fontControlled` which you hve to disable like so: `<Svgo* :fontControlled="false"/>`. If the usecase is to have the flexibilty of applying classes throughout the app then you need to make a change in the nuxt.config

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  svgo: {
    autoImportPath: "./assets/icons",
    defaultImport: "component", // this enables you to style things as you want: https://github.com/cpsoinos/nuxt-svgo/issues/122#issuecomment-1595264212
  },
});
```
