---
'@scayle/storefront-boilerplate-nuxt': minor
---

Renamed the `default` image provider to `scayle` to improve clarity and removed the default provider setting
in the `@nuxt/image` module settings to allow using local images with the `NuxtImg` component.

For this, place your local image into the `public/` folder and use the following component:

```vue
<NuxtImg src="/{fileName}" />
```

_(NOTE: The filename should be without the `/public` folder name.)_
