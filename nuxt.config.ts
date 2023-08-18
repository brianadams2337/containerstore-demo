// https://nuxt.com/docs/api/configuration/nuxt-config
const locales = [
  /* eslint-disable sonarjs/no-duplicate-string */
  {
    code: "en",
    iso: "en-GB",
    domain: "",
    file: "en-GB.json",
  },
  {
    code: "de",
    iso: "de-DE",
    domain: "",
    file: "de-DE.json",
    shopId: 1001,
  },
  {
    code: "de-at",
    iso: "de-AT",
    domain: "",
    file: "de-DE.json",
  },
  {
    code: "de-ch",
    iso: "de-CH",
    domain: "",
    file: "de-DE.json",
  },
  /* eslint-enable sonarjs/no-duplicate-string */
];

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    "nuxt-svgo",
    "@nuxt/image",
    "@nuxtjs/i18n",
    "nuxt-lazy-hydrate",
    "nuxt-jsonld",
  ],
  svgo: {
    autoImportPath: "./assets/icons",
    defaultImport: "component",
  },
  image: {
    domains: ["https://a.storyblok.com"],
    storyblok: {
      baseURL: "https://a.storyblok.com",
      modifiers: {
        // set default quality as modifier. This will force also storyblok to use webp if the client supports it.
        // Setting the format via the format modifier will force the format even when it's not supported by the client.
        quality: "85",
      },
    },
    providers: {
      default: {
        name: "default",
        provider: "~/providers/default",
        options: { baseURL: "https://brb-demo.cdn.aboutyou.cloud/" },
      },
    },
    intersectOptions: { rootMargin: "50px" },
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536,
    },
  },
  i18n: {
    locales,
    differentDomains: false,
    detectBrowserLanguage: false,
    defaultLocale: "de",
    langDir: "langs/",
    lazy: true,
    strategy: "prefix",
    vueI18n: "./i18n.config.ts",
  },
});
