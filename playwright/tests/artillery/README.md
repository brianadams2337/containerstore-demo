# Storefront Boilerplate / Load testing with Artillery and Playwright

- [Artillery Documentation ](https://www.artillery.io/docs)
- [Using Artillery with Playwright ](https://www.artillery.io/docs/playwright)

## Installing Artillery

`yarn add -D artillery@latest`

## Test structure

> Artillery config files are stored in directory `playwright/tests/artillery/config*.yml`.
> Artillery scenarios files are stored in directory `playwright/tests/artillery/scenarios/*.yml`.
> File `playwright/tests/artillery/testScripts.ts` contains test methods that serve as `testFunction` in Artillery scenario file.

## Running the tests locally

> To run the tests locally, open `playwright/` directory in terminal.

> If you want to run Homepage load test with constant virtual users arrival using default values, run the command `artillery run tests/artillery/configConstantArrival.yml tests/artillery/scenarios/loadHomepage.yml`.
> This command will run the test with pre-defined setup defined in `configConstantArrival.yml` file and it will inject 2 users every second for 30 seconds duration.

> You can override default values of the test above by running the following command:

```
artillery run \
    --overrides '{"config": { "phases": [{ "duration": 40, "arrivalRate": 4 }] } }' \
    tests/artillery/configConstantArrival.yml tests/artillery/scenarios/loadHomepage.yml
```

> The command above will override default values defined in `configConstantArrival.yml` and run the tests in duration of 40 seconds, injecting 4 users every second.
