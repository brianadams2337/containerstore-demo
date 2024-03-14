<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://scayle.dev/en/dev/storefront-core/introduction">
    <img src="docs/images/scayle.svg" alt="Logo" height="80">
  </a>

  <h3 align="center">SCAYLE Storefront Boilerplate Nuxt</h3>

  <p align="center">
    A <a href="https://nuxt.com/docs/getting-started/introduction" target="_blank" >Nuxt 3</a>-based Boilerplate to kick-start your SCAYLE Storefront application development.
    <br />
    <a href="https://scayle.dev/en/dev/storefront-core/introduction"><strong>Explore the docs »</strong></a>
    <br />
</div>

<!-- ABOUT THE PROJECT -->

## About Storefront Core and Storefront Boilerplate

Storefront Core is an all-in-one starter kit for building high-performance e-commerce shops for the SCAYLE Commerce Engine. It makes it quick and easy to build a best-in-class shop frontend. The latest version of Storefront Core is based on Nuxt and Vue 3 and consists of two parts:

- Storefront Core (_SFC_) The headless storefront that provides design-agnostic business logic and integrations with the SCAYLE backend.
- Storefront Boilerplate (_SFB_) A complete starter Nuxt application that includes the Storefront Core along with all features and pages that are required for a modern e-commerce frontend.

Storefront Core is built in a way that makes it easy to change or extend the shop design. An advantage of this approach is that the effort for launching a new e-commerce shop is drastically reduced because you only have to focus on the UI and design layer.

Should you encounter any errors, please reach out to your Scayle representative or the Storefront Core team for quick support.

### Built With

- [![Nuxt](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82)](https://nuxt.com/docs/getting-started/introduction)
- [![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)](https://vuejs.org/guide/introduction.html)
- [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/docs/installation)

## Getting Started

The following outline should provide you with an overview of how to get your local development environment using the Storefront Boilerplate up and running.
For more in-depth explanations and How-to guides, please consult the [SCAYLE Resource Center](https://scayle.dev/en/dev/storefront-core/introduction).

### Prerequisites

- `node` >= 20.7.0
- `yarn` (v1)

  ```sh
  npm install --global yarn
  ```

- `redis`

  Depending on the circumstances the usage of redis `docker` image for the local setup might not be necessary or might result in degraded performance. In this case, it is sufficient to have a locally installed version of `redis` / `redis-server` available.

### Installation

1. Get the required SCAYLE credentials and API Keys via your SCAYLE Customer Success Manager. If they are not yet provided to you, please reach out to your respective SCAYLE representative.
2. Use your provided SCAYLE credentials and API Keys to create a local `.env` file in the main directory based on the provided `.env.example` file.

   _For an in-depth explanation of the required environment variables, please consult the [SCAYLE Resource Center](https://scayle.dev/en/dev/storefront-core/introduction)._

3. Install dependencies

   ```sh
     yarn install
   ```

4. Create a local HTTPS certificate, as features like Checkout will require a working HTTPS connection

   _Check [How to turn on local HTTPS](#how-to-turn-on-local-https) for detailed instructions._

### Usage

1. Start a local `redis-server` instance
2. Start the local dev server of Storefront Boilerplate / Nuxt 3

   ```sh
     yarn dev
   ```

3. Open the Storefront Boilerplate running under <http://localhost:3000/>

#### Docker Compose

Suppose you don't need to develop and make changes to the application; we provide a simple docker-compose setup to run the application without installing the dependencies locally on your machine.

```sh
# Without SSL setup
docker compose --profile node up --build

# With SSL setup
SSL_CERT=$(cat ./localhost.crt) SSL_KEY=$(cat ./localhost.pem) docker compose --profile node up --build
```

Depending on your SSL setup open either <http://localhost:3000> or <https://localhost:3000>

## Local HTTPS

### How to turn on local HTTPS

To generate a certificate and key, we recommend using the [mkcert](https://github.com/FiloSottile/mkcert) tool.  
Follow the [mkcert installation instructions (Github)](https://github.com/FiloSottile/mkcert/blob/master/README.md#installation) and afterward run:

```sh
mkcert --key-file localhost.pem --cert-file localhost.crt localhost
```

After generating the local key and certificate file, add both to your `.env`-file as follows

```yaml
HTTPS_KEY=localhost.pem
HTTPS_CERT=localhost.crt
```

Your project will now be served on <https://localhost:3000>.
Please keep in mind that the shop accessed through <http://localhost:3000> might not be reachable anymore.

### How to turn off local HTTPS

As the local HTTPS encryption is directly coupled to the `HTTPS_KEY` and `HTTPS_CERT`,
simply remove or comment out the entries in your `.env`-file, like this:

```ini
# HTTPS_KEY=localhost.key
# HTTPS_CERT=localhost.crt
SOME_OTHER_ACTIVE_KEY=someValue
```

Use <http://localhost:3000/> to open the shop

## Running a production-like preview

Run `yarn build` to build the latest changes and followed by `yarn preview`.
Keep in mind that a `redis-server` needs to be running.
This will run the generated nuxt application from the `.output/` directory, similar to how the application will be deployed on a production server.
The only difference here is that all relevant `NUXT_` runtimeConfig override values are sourced from the local `.env` file.

## Testing

For testing with Nuxt 3, we provide a [@nuxt/test-utils](https://github.com/nuxt/test-utils) integration. It allows us to use a Nuxt environment in [vitest](https://vitest.dev/).
For ease of use we use `.nuxt.test.ts` or `.nuxt.spec.ts` file suffix for our tests to use nuxt env.

## Storyblok Scripts

As part of the Storefront Boilerplate `package.json`, some additional scripts are included to interact with Storyblok.

To interact with Storyblok, a `STORYBLOK_PERSONAL_TOKEN` and the `STORYBLOK_SPACE_ID` need to be set as part of a dedicated `.env.storyblok` file.
Check [scayle.dev/.../storefront-core/cms-integration-overview#initial-development-setup](https://scayle.dev/en/dev/storefront-core/cms-integration-overview#initial-development-setup) for more details.

- `storyblok:download`
  - Downloads the latest components from the respective Storyblok space using Storyblok CLI
- `storyblok:generate`
  - Uses the downloaded components JSON schema and transforms it into TypeScript types (See [scayle.dev/.../storefront-core/cms-integration-overview#type-definitions](<[#type-definitions](https://scayle.dev/en/dev/storefront-core/cms-integration-overview#type-definitions)>))
- `storyblok:login`
  - Authenticates local development environment with Storyblok CLI
- `storyblok:unused`
  - Outputs overview of used and unused Storyblok components

While `storyblok:download` and `storyblok:login` are directly utilizing the Storyblok CLI,
`storyblok:generate` and `storyblok:unused` are executing dedicated `.cjs` scripts.

### Script: storyblok:generate

The `storyblok:generate` script, located at `scripts/storyblok-generate.cjs`, creates a TypeScript type definition based on the local Storyblok components JSON schema.
The JSON schema needs to be downloaded before running this command.

The generated TypeScript type definition will be located at `storyblok/types/storyblok.gen.d.ts`.

To create the generated type definition, the script uses a NPM package called `storyblok-generate-ts`, which provides a configurable transformation function `storyblokToTypescript()`.This function facilitates the actual transformation of the JSON schema and outputs the type definition based on the passed configuration object, which is pre-configured for usage with the SCAYLE Storefront Boilerplate.

### Script: storyblok:unused

The `storyblok:unused` script, located at `scripts/storyblok-unused.cjs`, creates a list of all unused components of a space by utilizing the Storyblok management API.

The script is taken from <https://www.storyblok.com/faq/how-to-get-all-unused-components>.

## Viewing Storefront API calls for debugging

Depending on the task at hand its necessary to intercept and debug API calls from SFC.
For this purpose it is recommended to use an interactive HTTP(S) proxy that allows to inspect the made API calls.

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

## Patches

In some cases, patches to third-party packages are required. The Storefront Boilerplate uses [`patch-package`](https://www.npmjs.com/package/patch-package) to manage patching. The tool will run in `postinstall` and apply any patches present in the `patches/` directory.

### Current applied patches

- `@nuxt/image` - Support providing the base URL through runtime configuration
- `unstorage` - Log the driver name instead of `undefined` when VercelKV is used
