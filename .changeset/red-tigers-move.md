---
'@scayle/storefront-application-nuxt': minor
---

[UI] The `useFirstDayOfWeek` composable and `intl.first_day` translation key have been removed. As a result, `SFStoreOpeningTimesSummary.vue` will consistently display opening hours beginning with Mondays regardless of the locale, simplifying its implementation. If you need localized behavior, you can re-add the following composable to your Storefront Application.

```ts
const useFirstDayOfWeek = function () {
  const currentShop = useCurrentShop()
  const i18n = useI18n()
  const locale = new Intl.Locale(currentShop.value.locale)
  return 'getWeekInfo' in locale && typeof locale.getWeekInfo === 'function'
    ? locale.getWeekInfo().firstDay
    : parseInt(i18n.t('intl.first_day')) ?? 1
}
```
