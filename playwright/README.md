# Storefront Boilerplate / End-to-End Testing with Playwright

- [Official Playwright Documentation](https://playwright.dev/docs/intro)

## In a nutshell

> Playwright is an open-source automation library for browser testing developed by Microsoft.
> First release was launched in 2020.
>
> Playwright makes it possible to:
>
> - Set up tests
> - Write tests
> - Run tests
> - Debug Tests

## Playwright Features

> Playwright key features are:
>
> - **Cross-browser:** Playwright supports all modern rendering engines including Chromium, Firefox and WebKit, using single API.
> - **Cross-platform:** Test on Windows, Linux or MacOS, locally or on CI, in headless or headed mode.
> - **Cross-language:** Use the Playwright API in TypeScript, JavaScript, Python, .Net or Java.
> - **Test Mobile Web:** Native mobile emulation of Google Chrome for Android and Mobile Safari for iOS.

## Integration with TestRail

> There is a possibility to integrate your Playwright automated tests and your TestRail test suites by linking the Playwright test results with TestRail project.

### Setup

> To use this feature, you need to set up the following environment variables:
>
> - TESTRAIL_HOST: Your TestRail instance domain name e.g `https://yourinstance.testrail.io`
> - TESTRAIL_USERNAME: Your TestRail email
> - TESTRAIL_PASSWORD: TestRail API key (Generate this or use an existing one from the 'My Settings' page on your TestRail instance)
> - TESTRAIL_PROJECT_ID: TestRail project ID where test runs and results will be added - it is important to add this, especially if you have more than one project in your TestRail instance
> - TESTRAIL_SUITE_ID: The TestRail suite ID associated with the test cases
> - TESTRAIL_RUN_NAME: The name of the TestRail test run. (the execution time will be appended to this name on when created on TestRail)
> - TESTRAIL_RUN_ID: If you want to use existing TestRail test run ID, you can specify it here. If you leave this blank, then the new test run will be automatically created every time you run the tests.

### Usage

> - Add the TestRailReporter instance to the reporters array in your Playwright Test configuration file playwright.config.ts (already added in this project)

```export default defineConfig({
  reporter: [
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['playwright-testrail-reporter'],
  ],
  // ...
}
```

> - In your test files, add TestRail test case ID to the test name as shown in the following example:

```test('C2130649: Verify User login with wrong credentials', async ({
    // ...
})
```
