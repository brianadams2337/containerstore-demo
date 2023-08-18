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

export default {
  locales,
  differentDomains: false,
  detectBrowserLanguage: false,
  defaultLocale: "de",
  langDir: "langs/",
  lazy: true,
  strategy: "prefix",
  vueI18n: "./i18n.config.ts",
};
