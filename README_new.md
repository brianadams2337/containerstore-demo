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

- Storefront Core (*SFC*) The headless storefront which provides design-agnostic business logic and integrations with the SCAYLE backend.
- Storefront Boilerplate (*SFB*) A complete starter Nuxt application which includes the Storefront Core along with all features and pages that are required for a modern e-commerce frontend.

Storefront Core is built in a way that makes it easy to change or extend the shop design. An advantage of this approach is that the effort for launching a new e-commerce shop is drastically reduced because you only have to focus on the UI and design layer.

Should you encounter any errors, please reach out to your Scayle representative or the Storefront Core team for quick support.

### Built With

* [![Nuxt](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82)](https://nuxt.com/docs/getting-started/introduction)
* [![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)](https://vuejs.org/guide/introduction.html)
* [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/docs/installation)

## Getting Started

The following outline should provide you with an overview on how to get your local development environment using the Storefront Boilerplate up and running.
For more in-depth explanations and How-to guides, please consult the [SCAYLE Resource Center](https://scayle.dev/en/dev/storefront-core/introduction).

### Prerequisites

- `node` >= 20.7.0
- `yarn` (v1)

  ```sh
  npm install --global yarn
  ```
* `redis`

  Depending on the circumstances the usage of redis `docker` image for the local setup might not be necessary or might result in degraded performance. In this cases it is sufficient to have a locally installed version of `redis` / `redis-server` available.

### Installation

1. Get required SCAYLE credentials and API Keys via your SCAYLE Customer Success Manager. If they are not yet provided you you, please reach out to your respective SCAYLE representative.
2. Use your provided SCAYEL credentials and API Keys to create a local `.env` file in the main directory based on the provided `.env.example` file.

   *For an in-depth explanation of the required environment variables, please consult the [SCAYLE Resource Center](https://scayle.dev/en/dev/storefront-core/introduction).*
3. Install dependency packages

   ```sh
     yarn install
   ```
4. Create a local HTTPS certificate

   *Check [How to turn on local HTTPS](#how-to-turn-on-local-https) for detailed instructions.*

## Usage

1. Start a local `redis-server` instance
2. Start the local dev server of Storefront Boilerplate / Nuxt 3

   ```sh
     yarn dev
   ```

3. Open the Storefront Boilerplate running under <http://localhost:3000/>

## How to turn on local HTTPS

To generate a certificate and key, run the following command in your project folder and follow the prompt to provide the certificate with dummy data in the terminal.
You can use `.` to fill out the certificate creation with blank data, as there is no need to input any actual data (e.g. `Country Name (2 letter code) []:.`).

```sh
openssl req -x509 -newkey rsa:4096 -keyout localhost.pem -out localhost.crt -sha256 -days 365
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
Only difference here is that all relevant `NUXT_` runtimeConfig override values are sourced from the local `.env` file.

## Testing

For testing with Nuxt 3 we provide a [nuxt-vitest](https://github.com/danielroe/nuxt-vitest) integration. It allows us to use a Nuxt environment in [vitest](https://vitest.dev/).
For ease of use we use `.nuxt.test.ts` or `.nuxt.spec.ts` file suffix for our tests to use nuxt env.
