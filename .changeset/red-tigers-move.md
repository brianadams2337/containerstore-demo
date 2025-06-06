---
'@scayle/storefront-application-nuxt': minor
---

**\[UI\]** To provide a more consistent and predictable user experience, the `SFStoreOpeningTimesSummary.vue` component will now always display the week starting on Monday.
We've removed the locale-specific `useFirstDayOfWeek` composable and the corresponding `intl.first_day` translation key to achieve this.
If your project requires a localized start day, you can re-implement this functionality using the composable below.

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
