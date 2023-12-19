# Storefront Boilerplate / End-to-End Testing with Cypress

- [Official Cypress Documentation ](https://docs.cypress.io/guides/overview/why-cypress)

## In a nutshell
> Cypress is a next generation front end testing tool built for the modern web.
> Cypress addresses the key pain points developers and QA engineers face when testing modern applications.
>
> Cypress makes it possible to:
>
> - Set up tests
> - Write tests
> - Run tests
> - Debug Tests
>
> Cypress is most often compared to Selenium; however Cypress is both fundamentally and architecturally different.
> Cypress is not constrained by the same restrictions as Selenium.
>
> This enables you to write faster, easier and more reliable tests.
>
> Cypress enables you to write all types of tests:
>
> - End-to-end tests
> - Component tests
> - Integration tests

- Source: [Official Cypress Documentation / In a nutshell](https://docs.cypress.io/guides/overview/why-cypress#In-a-nutshell)

## Cypress Features

> Cypress comes fully baked, batteries included. Here is a list of things it can do that no other testing framework can:
>
> - **Time Travel:** Cypress takes snapshots as your tests run.
>   Hover over commands in the Command Log to see exactly what happened at each step.
> - **Debuggability:** Stop guessing why your tests are failing.
>   Debug directly from familiar tools like Developer Tools.
>   Our readable errors and stack traces make debugging lightning fast.
> - **Automatic Waiting:** Never add waits or sleeps to your tests.
>   Cypress automatically waits for commands and assertions before moving on. No more async hell.
> - **Spies, Stubs, and Clocks:** Verify and control the behavior of functions, server responses, or timers.
>   The same functionality you love from unit testing is right at your fingertips.
> - **Network Traffic Control:** Easily control, stub, and test edge cases without involving your server.
>   You can stub network traffic however you like.
> - **Consistent Results:** Our architecture doesn't use Selenium or WebDriver.
>   Say hello to fast, consistent and reliable tests that are flake-free.
> - **Screenshots, Videos, and Test Replay:** View screenshots taken automatically on failure,
>   or videos, if enabled, of your entire test suite when run from the CLI.
>   Record to Cypress Cloud and replay the test as it executed during the run for zero-configuration debugging using Test Replay.
> - **Cross Browser Testing:** Run tests within Firefox and Chrome-family browsers (including Edge and Electron)
>   locally and optimally in a Continuous Integration pipeline.
> - **Smart Orchestration:** Once you're set up to record to Cypress Cloud, easily parallelize your test suite,
>   rerun failed specs first with Spec Prioritization, and cancel test runs on failures with Auto Cancellation for tight feedback loops.
> - **Flake Detection:** Discover and diagnose unreliable tests with Cypress Cloud's Flaky test management.

- Source: [Official Cypress Documentation / Features](https://docs.cypress.io/guides/overview/why-cypress#Features)

## CI Integration

### Using cypress-split for parallelization

We're using `cypress-split` to run specs across parallel CI machines for speed without using any external services.
Should you wish to integrate with the official Cypress Dashboard, the `cypress.config.ts` needs to be updated accordingly.

- [Cypress Split on Github](https://github.com/bahmutov/cypress-split)

#### cypress-split with Gitlab CI

For the `cypress-split` plugin to properly work within the Gitlab CI,
it might be required to set the following configurations for the respective CI job:

```yaml
.test_e2e_cypress-base:
  stage: "Post Deploy"
  image:
    name: cypress/included:cypress-13.6.2-node-20.10.0-chrome-118.0.5993.88-1-ff-118.0.2-edge-118.0.2088.46-1
  variables:
    BROWSER: chrome
    MOBILE: "false"
    CYPRESS_COMMERCIAL_RECOMMENDATIONS: 0 # Disable Cypress Telemetry
    CYPRESS_CRASH_REPORTS: 0 # Disable Cypress Telemetry
    CI_NODE_TOTAL: ${CI_NODE_TOTAL} # Required for cypress test suite splitting
    CI_NODE_INDEX: ${CI_NODE_INDEX} # Required for cypress test suite splitting
    SPLIT: "true" # Required for cypress test suite splitting
  parallel: 3
  script:
    - npm run cy:run --record false --browser ${BROWSER} --env split=${SPLIT},mobile=${MOBILE}
```

#### Generating reports with cypress-split

If you don't want to rely on the Cypress Dashboard to record our test runs and subsequently generate the reports,
we're recommending [mochawesome](https://github.com/adamgruber/mochawesome) to create individual JSON reports.

- [Using Mochawesome with Cypress](https://github.com/cypress-io/testing-workshop-cypress/blob/master/slides/09-reporters/PITCHME.md#mochawesome)
