# SCAYLE Storefront Boilerplate - Nuxt 3 Migration

This document outlines the required steps to setup a Nuxt 2 based DemoShop with the SCAYLE Storefront Boilerplate.
Please keep in mind that this documentation is still being extended and will be regularly updated.

_Last updated: 20. September 2023_

[[TOC]]

## Creating a local .env file and setting proper shopId

To be able to startup the shop application locally, it is required to create a local only `.env` file.
This `.env` file will hold all relevant credentials, secrets and override values for the application.

The provided `.env.example` file contains the rough structure and required values for a local `.env` file.

```yaml
### Global Configuration ###

BASE_URL=http://localhost:3000
NUXT_PUBLIC_IMAGE_BASE_URL=''

AY_CACHE_DISABLED=true

NUXT_STOREFRONT_REDIS_HOST=localhost

NUXT_STOREFRONT_REDIRECTS_ENABLED=true

NUXT_STOREFRONT_BAPI_HOST=
NUXT_STOREFRONT_BAPI_TOKEN=

NUXT_STOREFRONT_OAUTH_API_HOST=
NUXT_STOREFRONT_OAUTH_CLIENT_ID=
NUXT_STOREFRONT_OAUTH_CLIENT_SECRET=

### Beginn Store-specific Configuration ###

NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_USER=
NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_TOKEN=
NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_SECRET=
NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_CHECKOUT_HOST=

NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_DOMAIN=

NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_STORE_CAMPAIGN_KEYWORD=

NUXT_STOREFRONT_STORES_{UNIQUE_IDENTIFIER}_IS_LOWEST_PREVIOUS_PRICE_ACTIVE=false
### End Store-specific Configuration ###

### Storyblok-specific Configuration ###
NUXT_STORYBLOK_ACCESS_TOKEN=

### Local Development ###
HTTPS_KEY=localhost.pem
HTTPS_CERT=localhost.crt

### LEGACY ###
BASIC_AUTH=##:##

```

It is important to set the used `{UNIQUE_IDENTIFIER}` needs to be equal to the key ( [shop.locale] or [shop.shopId] ) set of
the `shops.reduce` function in `config/storefront.ts`. We __strongly recommend__ to use the `shopId` as `{UNIQUE_IDENTIFIER}`!

- __RECOMMENDED__: Example if `[shop.shopId]` is used -> Overrideable environment variable: `NUXT_STOREFRONT_STORES_1001_CHECKOUT_USER`.
- Example if `[shop.locale]` is used -> Overrideable environment variable: `NUXT_STOREFRONT_STORES_EN_US_CHECKOUT_USER`.

For the shop application to properly start we also need to adjust the `shopId` value within `nuxt.config.ts` and
`config/storefront.ts` to be able to communicate with the SCAYLE Storefront API successfully.

### Sourcing required SCAYLE credentials

The relevant SCAYLE credentials should either be provided to you by the projects SCAYLE project manager.
If this is not yet the case, please reach out to the respective SCAYLE representative.
