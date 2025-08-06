---
'@scayle/storefront-application-nuxt': minor
---

**\[Basket\]** Express Checkout is now available on the basket page.
This feature, powered by the `<scayle-express-checkout />` web component, allows all users—including guests—to quickly proceed to checkout.
The authentication guard (`/app/middleware/authGuard.global.ts` and `/app/pages/checkout.vue`) has been updated to permit guest access when an express checkout `transactionId` is present in the URL query parameter.
For more details, see the [Express Checkout documentation](https://scayle.dev/en/checkout-guide/integration/express-checkout).
