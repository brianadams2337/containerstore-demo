---
'@scayle/storefront-boilerplate-nuxt': minor
---

Country Detection: Add automatic country detection and redirect prompt

## How it works

In the `onMounted` hook, we look up the country of the user and check if it matches the current shop. If it does not match, we try to find a shop which does match that country and prompt the user to switch to the other shop. When a user is logged in or has already declined the prompt, we no longer show the dialog.

## Disabling

If you want to disable this feature, remove the `<CountryDetection/>` component from the `default.vue` layout.

## Customizing

The default implementation of the country detection uses the timezone of the browser to assume the user's country. If you would like to use a different method such as GeoIP lookup, the `getCurrentCountryFromTimezone` function can be easily swapped out. The replacement function should return a single country code which represents the user's country, or `undefined` if one cannot be found. Or in other words a function which matches the interface `() => string | undefined`

It's also possible to customize the `getShopsForRegion` function. The default implementation will search the available shops for those which match the detected region. If there are multiple matches, multiple options will be presented in the dialog. A fallback `shopId` can be passed as the second argument. This is useful if you have a global shop. When no shop matches the user's region, this fallback will be used instead. If there are no matches and a fallback is not specified, the user will not be prompted.

The country names shown in the prompt use the default translation of the shop's country code. If you would like to override this behavior, extend the translations file with the key `country_selection.override_codes.CODE`. The code should be uppercase.
