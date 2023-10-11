# SCAYLE Storefront Boilerplate Nuxt (Demo Shop)

The SCAYLE Storefront Boilerplate Nuxt is based on the [ Nuxt 3 framework](https://nuxt.com/docs/getting-started/introduction).
Compared to the [Nuxt 2](https://v2.nuxt.com/) based DemoShop, there have been a multitude of changes due to the difference in overall framework architecture and more modern best practices,
while trying to keep the most possible similarities / compatibilities with the old Nuxt 2 based DemoShop.

PLEASE NOTE: The SCAYLE Storefront Boilerplate Nuxt and Storefront Core Nuxt have been newly developed and does not yet support all extended features as the Nuxt 2 based DemoShop currently does.

Should you encounter any errors, please reach out to your Scayle representative or the Storefront Core team for quick support.

## Current feature set

- Homepage / Landing page
- Product Listing Page
- Product Detail Page
- Basket
- Wishlist
- Checkout
- Order Success Page
- Order Detail Page
- Login / Logout (token-based only)

## Prerequisites

Before starting with this Boilerplate, we recommend to get familiar with Nuxt 3 and Vue 3, if this is not already the case:

- [Nuxt 3 Introduction](https://nuxt.com/docs/getting-started/introduction)
- [Vue 3 Introduction](https://vuejs.org/guide/introduction.html)

### Access

Make sure you have access to the private package registry to access packages like `@scayle/storefront-nuxt` and `@scayle/storefront-core`.
If not already done, see "Common Issues / Troubleshooting" section > [## Adding @aboutyou package registry](#adding-aboutyou-package-registry).

### Software

- `nvm`
- `node` >= 18.17.1
- `yarn` (v1)
- `redis`

### Installation

#### Install supported Node.js Version

To install the supported `Node.js` version, we recommend the usage of the **Node Version Manager**, short `nvm`.
After successful setup of `nvm`, run `nvm install 18.17.1` or `nvm install lts/hydrogen` for to download and install the latest supported `Node.js` version.

#### Using Redis locally

Depending on the circumstances the usage of `docker` for the local setup might not be necessary or might result in degraded performance.
In this cases it is sufficient to have a locally installed version of `redis` / `redis-server` available.

For MacOS this can be installed using `homebrew`

```sh
brew install redis

```

## Starting the application

1. You need to create a .env file in the main directory or rename the .env.example file.
   We will provide the credentials and URLs

2. Start the `redis-server` either locally

```sh
redis-server
```

or as a continuously running service under MacOS

```sh
brew services start redis
```

3. Start vue application using node version 18:

```sh
nvm use # Use specific node version specified in .nvmrc
yarn install # Install local dependencies
yarn dev # Run local dev server of shop
```

4. Use http://localhost:3000/ to open the shop.

### Run in in production-like preview

Run `yarn build` to build the latest changes and run `yarn preview`.
Keep in mind that `redis-server` needs to be running.
This will run the generated nuxt application from the `.output/` directory, similar to how the application will be deployed on a production server.
Only difference here is that all relevant `NUXT_` runtimeConfig override values are sourced from the local `.env` file.

## How to turn on HTTPS

To generate a certificate and key, run the following command in your project folder and follow the prompt to provide the certificate with dummy data in the terminal.
You can use `.` to fill out the certificate creation with blank data, as there is no need to input any actual data (e.g. `Country Name (2 letter code) []:.`).

```sh
openssl req -x509 -newkey rsa:4096 -keyout localhost.pem -out localhost.crt -sha256 -days 365
```

### Problems with Certificate Creation

The creation of a locally unsigned certificate might fail due to different circumstances.
Here are a few issues that have been encountered, followed by an alternative way of creation the required certificate.

#### Example: Certificate Creation fails on MacOS

```sh
8242600768:error:28FFF065:lib(40):CRYPTO_internal:result too small:((shortened...)):You must type in 4 to 1023 characters
8242600768:error:09FFF06D:PEM routines:CRYPTO_internal:problems getting password:(shortened...):115:
8242600768:error:09FFF06F:PEM routines:CRYPTO_internal:read key:(shortened...):129:
```

#### Example: Certificate can't be decrypted by Nuxt/Node.js SSL

```sh
FATAL  error:1C800064:Provider routines::bad decrypt
```

#### Alternative Certificate Creation

If the previous creation command fail or the certificate can't be decrypted by Nuxt,
try creating the necessary key file and certificate using an intermediate "Certificate Signing Request" file:

```sh
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out localhost.pem # Create RSA key file
openssl req -new -key localhost.pem -out localhost.csr # Create Certificate Signing Request file
openssl x509 -req -days 365 -in localhost.csr -signkey localhost.pem -out localhost.crt # Create Certificate
```

After generating the local key and certificate file, add both to your `.env`-file as follows

```yaml
HTTPS_KEY=localhost.pem
HTTPS_CERT=localhost.crt
```

The `.csr` is not needed afterwards and can be deleted.

Your project will now be served on https://localhost:3000.
Please keep in mind that the shop accessed through http://localhost:3000 might not be reachable.

### How to turn off HTTPS

As the local HTTPS encryption is directly coupled to the `HTTPS_KEY` and `HTTPS_CERT`,
simply remove or comment out the entries in your `.env`-file, like this:

```ini
# HTTPS_KEY=localhost.pem
# HTTPS_CERT=localhost.crt
SOME_OTHER_ACTIVE_KEY=someValue
```

### Common Issues / Troubleshooting

#### 'localhost has refused the connection' after login

- Probably it has something todo with the config try with:

```sh
https://de-de.localhost:3000
```

## Build for production and launch server

```sh
yarn build
yarn start
```

Use http://localhost:3000/ to open the shop

## Adding @scayle and @aboutyou package registry

Certain NPM package prefixed with `@aboutyou` and `@scayle` are not publicly available through `npmjs.org`,
or other public package registries, but will be installed from our own internal package registry.
Therefore we need to create a personal deploy token to get access to this registry.

The deploy token will be created for you.

Afterwards, please configure your local `npm` setup to allow access to the private `@aboutyou` and `@scayle` package registry.
The following command should be executed in your terminal and will modify your local `~/.npmrc` file but not the projects `.npmrc` file:

- [Gitlab Docs: Project Level NPM Endpoint](https://docs.gitlab.com/ee/user/packages/npm_registry/#project-level-npm-endpoint)

```sh
npm config set @aboutyou:registry https://gitlab.com/api/v4/projects/29746107/packages/npm/
npm config set @scayle:registry https://gitlab.com/api/v4/projects/29746107/packages/npm/
npm config set -- '//gitlab.com/api/v4/packages/npm/:_authToken' "<TOKEN>"
npm config set -- '//gitlab.com/api/v4/projects/29746107/packages/npm/:_authToken' "<TOKEN>"
```

Your global local `~/.npmrc` file should look similar to this afterwards:

```ini
@aboutyou:registry=https://gitlab.com/api/v4/projects/29746107/packages/npm/
@scayle:registry=https://gitlab.com/api/v4/projects/29746107/packages/npm/
//gitlab.com/api/v4/packages/npm/:_authToken=<TOKEN>
//gitlab.com/api/v4/projects/29746107/packages/npm/:_authToken=<TOKEN>
```

## Using @scayle/storefront-nuxt package locally

```sh
cd storefront-core-v2 # Navigate to mono repo
yarn install # Install dependencies
yarn build # Build @scayle/storefront-nuxt2 and @scayle/storefront-core sub-packages

cd packages/storefront-nuxt # Navigate to @scayle/storefront-nuxt2 sub-package
yarn link # Link @scayle/storefront-nuxt2 sub-package
cd ../storefront-core # Navigate to proper @scayle/storefront-core sub-package
yarn link # Link @scayle/storefront-core sub-package

cd ../../.. # Navigate outside of project directory
cd ay-cloud-shop-application-demo-v2/ # Navigate to demo shop directory
yarn link '@scayle/storefront-nuxt' '@scayle/storefront-core' # Link packages to demo shop
yarn install # Install dependencies
yarn dev # Run local dev server

```

## Lazy Loading with NuxtLazyHydrate

In Nuxt 2 we used the `vue-lazy-hydration` within our custom `Lazy` component
implementation. In Nuxt 3 we use `NuxtLazyHydrate` directly. It helps us defer
the rendering of a component to improve performance.

This example shows a grey placeholder 16:9 on desktop and square (1:1) on mobile.
As the users scrolls the page and the placeholder enters the viewport,
the components within are getting rendered. No rendering on server-side.

```vue
<NuxtLazyHydrate :placeholder-ratio="md ? '16/9' : '1/1'">
  ...
</NuxtLazyHydrate>
```

This example renders products in 2 columns on mobile and 4 columns on desktop.
It skips the lazy-loading for the first row on mobile and 2 rows on desktop,
because those are the ones visible to the user on page-load.

```vue
<NuxtLazyHydrate
  v-for="(product, index) in products"
  :key="product.id"
  :when-visible="{ rootMargin: '100px' }"
  :when-triggered="index < (isGreaterOrEquals('md') ? 8 : 2)"
  class="col-span-6 md:col-span-3"
  placeholder-class="mb-24"
  placeholder-ratio="3/4">
  ...
</NuxtLazyHydrate>
```

### When and how to pre-render on server-side (never hydrate)?

_How_?

```vue
// Usage:
<NuxtLazyHydrate>
  // Content will never be hydrated
</NuxtLazyHydrate>
```

_When?_

- If the component is within the browser viewport on page-load.
- If the generated HTML contains important things for SEO (e.g. h1).
- If it takes a long time to render, it might be better to show the pre-rendered version first.

## Storyblok Scripts

There are some extra `package.json` scripts for working with Storyblok.
They depend on having `STORYBLOK_PERSONAL_TOKEN` and `STORYBLOK_SPACE_ID` in your .env.storyblok file.

`STORYBLOK_PERSONAL_TOKEN` can be created here.
`STORYBLOK_SPACE_ID` can be found in the URL when logged into storyblok.com

- `yarn storyblok:unused` - reports the usage of Storyblok components
- `yarn storyblok:login` - logs in to the storyblok cli (required for the download task)
- `yarn storyblok:download` - downloads the current JSON schema of the storyblok components
- `yarn storyblok:generate` - transforms the JSON schema into TypeScript types

## Intercept API calls from SFC for debugging purposes

Depending on the task at hand its necessary to intercept and debug api calls from SFC.
For this purpose it is recommended to use an interactive HTTP(S) proxy that allows to inspect the made api calls.

### Recommendation: mitmproxy

[`mitmproxy`](https://mitmproxy.org/) is a free and open source interactive HTTPS proxy,
licensed under the [MIT license](https://github.com/mitmproxy/mitmproxy/blob/main/LICENSE).
It is available for MacOS, Linux and Windows.

Some of its features include:

- Intercept HTTP & HTTPS requests and responses and modify them on the fly
- Save complete HTTP conversations for later replay and analysis
- Transparent proxy mode on macOS and Linux
- SSL/TLS certificates for interception are generated on the fly
- and [more features](https://docs.mitmproxy.org/stable/overview-features/)

#### Use mitmproxy

Firstly follow the [official install instruction](https://docs.mitmproxy.org/stable/overview-installation/) to install `mitmproxy`.
To intercept and debug API calls, we will be relying on `mitmproxy`'s core tool [`mitmweb`](https://docs.mitmproxy.org/stable/#mitmweb).

For `mitmproxy` to be able to intercept HTTP(S) requests, we need to configure our shop `.env` file and add the following two values:

```ini
https_proxy=http://127.0.0.1:8080
http_proxy=http://127.0.0.1:8080
```

After starting both `mitmproxy` and our shop, we should be able to now see all relevant HTTP(S) requests and API calls in the `mitmweb` tab.


# Testing

For testing in Nuxt 3 we can use [Nuxt-Vitest](https://github.com/danielroe/nuxt-vitest). It is a Nuxt 3 module that allows us to use Nuxt environment in [Vitest](https://vitest.dev/). For ease of use we use `.nuxt.test.ts` or `.nuxt.spec.ts` file suffix for our tests to use nuxt env.
