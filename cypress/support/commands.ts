import { shopSelectorBasedPath } from '../test-helpers'

// import { TrackingEvent } from '@scayle/storefront-nuxt'
const _get = Cypress._.get // Cypress has lodash available
// some tracking events are not mapped in the core type but used in this shop
type FilterTrackingEvent = 'filter_slider'
type PurchaseTrackingEvent = 'purchase'
type DemoShopTrackingEvent = FilterTrackingEvent | PurchaseTrackingEvent | any //  | TrackingEvent
type DataLayer = Array<{ [key: string]: any }>
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface ApplicationWindow {
      dataLayer: DataLayer
    }

    interface Chainable {
      langFixture: typeof cy.fixture
      /**
       * @deprecated You should use `getBySelector('foo-id')` instead
       */
      testId(
        testIdValue: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable
      /**
       * @deprecated You should use `getBySelector('foo-id bar-id', options)` instead
       */
      testIds(
        testIdValues: string[],
        options?: Parameters<typeof cy.get>[1],
      ): Chainable
      getBySelector(
        testIdValue: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable
      /**
       * Similar to getBySelector but will find matches based in a pattern. For example: `getBySelectorLike('product-card-id-')` to match any element that starts with this "product-card-id-" pattern
       */
      getBySelectorLike(
        testIdValue: string,
        options?: Parameters<typeof cy.get>[1],
      ): Chainable
      visitAndWait(
        url: string,
        options?: Partial<
          { removeTransferState: boolean } & Cypress.VisitOptions
        >,
      ): Chainable
      waitForAppReady(): Chainable
      findTrackingEvent: (
        event: DemoShopTrackingEvent,
        dataLayer: any[],
      ) => Promise<boolean & any>
      waitForXHR(waitingTime?: number): Chainable
      clearSiteData(): Chainable
      shortWait(): Chainable
      loadPLP: () => void
      iframe: () => any
      expectTrackingEventInDatalayer(
        event: DemoShopTrackingEvent,
      ): Cypress.Chainable<void>
      verifyDataLayerEventProperty(
        event: DemoShopTrackingEvent,
        path: Parameters<typeof _get>[1],
      ): Cypress.Chainable<void>
      checkDataLayerEventPropertyValue(
        event: DemoShopTrackingEvent,
        path: Parameters<typeof _get>[1],
        value: any,
      ): Cypress.Chainable<any>
      getDataLayerEventPropertyValue(
        event: DemoShopTrackingEvent,
        path: Parameters<typeof _get>[1],
      ): Cypress.Chainable<any>
      verifyDataLayerHasEcommerceNullBefore(
        event: DemoShopTrackingEvent,
      ): Cypress.Chainable<any>
      expectEventsInOrder(
        events: DemoShopTrackingEvent[],
      ): Cypress.Chainable<any>
      signInWithEnvUser(): void
    }
  }
}

Cypress.Commands.add('langFixture', langFixture)
function langFixture<Contents = any>(
  fixtureName: string,
): Cypress.Chainable<Contents> {
  return cy.fixture(`${fixtureName}.${Cypress.env('lang')}`)
}

Cypress.Commands.add('testId', getBySelector)
Cypress.Commands.add('getBySelector', getBySelector)

Cypress.Commands.add('signInWithEnvUser', signInWithEnvUser)

export function signInWithEnvUser() {
  cy.getBySelector('login-email')
    .click()
    .type(Cypress.env('username'))
    .getBySelector('login-password')
    .click()
    .type(Cypress.env('password'), { log: false })
    .getBySelector('login-submit')
    .click()
}
/**
 *
 * @param selector accepts a string, when separated by spaces it will look for children ids like `[data-test-id="parent-foo"] [data-test-id="child-bar"]`.
 * @param args same args as the ones used in a cy.get(selector, ...args)
 * @returns
 */
export function getBySelector(selector: string, ...args: any) {
  return cy.get(selectorBuilder(selector), ...args)
}

Cypress.Commands.add('getBySelectorLike', getBySelectorLike)
export function getBySelectorLike(selector: string, ...args: any) {
  return cy.get(selectorBuilder(selector, { operator: '*=' }), ...args)
}

Cypress.Commands.add('visitAndWait', (url: string) => {
  const normalizedUrl = shopSelectorBasedPath(url)

  if (Cypress.env().mobile === true) {
    cy.visit(normalizedUrl, {
      onBeforeLoad: (win) => {
        // @ts-expect-error Type 'boolean' is not assignable to type '((this: GlobalEventHandlers, ev: TouchEvent) => any) & ((this: Window, ev: TouchEvent) => any)'.
        win.ontouchstart = true
      },
    })
  } else {
    cy.visit(normalizedUrl)
  }
})

Cypress.Commands.add('waitForAppReady', waitForAppReady)
/**
 * Waits until frontend app is setting window.appReady = true on NavigationEnd
 */
export function waitForAppReady(): Cypress.Chainable {
  return cy.window({ timeout: 20000 }).should('have.property', 'appReady', true)
}

Cypress.Commands.add('clearSiteData', () => {
  try {
    cy.clearCookies()
    cy.clearLocalStorage()
  } catch (e) {
    cy.log(`[clearSiteData] Error: ${e}`)
  }
})

Cypress.on('uncaught:exception', (_err, _runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})

const findTrackingEvent = (
  event: DemoShopTrackingEvent,
  dataLayer: DataLayer,
) => {
  return new Promise((resolve: any) => {
    let indexFound = -1
    for (let i = 0; i < dataLayer.length; i++) {
      if (dataLayer[i].event === event) {
        indexFound = i
        break
      }
    }
    resolve(indexFound)
  })
}
Cypress.Commands.add('findTrackingEvent', findTrackingEvent)

Cypress.Commands.add('waitForXHR', (waitingTime = 2500) => cy.wait(waitingTime))

Cypress.Commands.add('shortWait', () => cy.wait(1500))

type SelectorBuildOptions = {
  selectorIdentifier?: string
  operator?: string
}

const selectorBuilder = (
  selector: string,
  options: SelectorBuildOptions = {
    selectorIdentifier: 'data-test-id',
    operator: '=',
  },
) => {
  if (!selector || selector?.length === 0) {
    throw new Error(
      'Wrong selector provided. For multiple selectors separate them by space.',
    )
  }
  const { selectorIdentifier, operator } = options
  return selector
    .split(' ')
    .map((id: string) => `[${selectorIdentifier}${operator}"${id}"]`) // return looks like this: `[data-test-id="foo-identifier"]`
    .join(' ')
}

/**
 * ALL IFRAME WORKAROUND came from here: https://medium.com/appear-here-product-engineering/testing-iframes-with-cypress-including-stripe-and-hellosign-fed90d639870
 *
 * Will check if an iframe is ready for DOM manipulation. Just listening for the
 * load event will only work if the iframe is not already loaded. If so, it is
 * necessary to observe the readyState. The issue here is that Chrome initialises
 * iframes with "about:blank" and sets their readyState to complete. So it is
 * also necessary to check if it's the readyState of the correct target document.
 *
 * Some hints taken and adapted from:
 * https://stackoverflow.com/questions/17158932/how-to-detect-when-an-iframe-has-already-been-loaded/36155560
 *
 * @param $iframe - The iframe element
 */
const isIframeLoaded = ($iframe: any) => {
  const contentWindow = $iframe.contentWindow

  const src = $iframe.attributes.src
  const href = contentWindow.location.href
  if (contentWindow.document.readyState === 'complete') {
    return href !== 'about:blank' || src === 'about:blank' || src === ''
  }

  return false
}

/**
 * Wait for iframe to load, and call callback
 *
 * Some hints taken and adapted from:
 * https://gitlab.com/kgroat/cypress-iframe/-/blob/master/src/index.ts
 */
const iframeFn = ($iframes: any) =>
  new Cypress.Promise((resolve: any) => {
    const loaded: any = []

    $iframes.each((_: any, $iframe: any) => {
      loaded.push(
        new Promise((subResolve) => {
          if (isIframeLoaded($iframe)) {
            subResolve(($iframe as any).contentDocument.body)
          } else {
            Cypress.$($iframe).on('load.appearHere', () => {
              if (isIframeLoaded($iframe)) {
                subResolve(($iframe as any).contentDocument.body)
                Cypress.$($iframe).off('load.appearHere')
              }
            })
          }
        }),
      )
    })

    return Promise.all(loaded).then(resolve)
  })
Cypress.Commands.add('iframe', { prevSubject: 'element' }, iframeFn)

const expectTrackingEventInDatalayer = (event: DemoShopTrackingEvent) => {
  return cy.window().then(({ dataLayer }) => {
    return cy.findTrackingEvent(event, dataLayer).then((eventIndex) => {
      expect(eventIndex).to.be.greaterThan(-1)
    })
  })
}

Cypress.Commands.add(
  'expectTrackingEventInDatalayer',
  expectTrackingEventInDatalayer,
)

const findDataLayerEvent = (
  event: DemoShopTrackingEvent,
  dataLayer: DataLayer,
) => dataLayer.find((dataLayerEvent) => dataLayerEvent.event === event)

const getDataLayerEventPropertyValue = (
  event: DemoShopTrackingEvent,
  path: Parameters<typeof _get>[1],
) => {
  return cy.window({ log: false }).then(({ dataLayer }) => {
    const dataLayerEvent = findDataLayerEvent(event, dataLayer)
    // Using cy.wrap here is a workaround for cypress not being able to handle undefined value and returning the previous value instead: "cy.window()" in this case
    return cy.wrap(_get(dataLayerEvent, path, undefined), { log: false })
  })
}

Cypress.Commands.add(
  'getDataLayerEventPropertyValue',
  getDataLayerEventPropertyValue,
)

const checkDataLayerEventPropertyValue = (
  event: DemoShopTrackingEvent,
  path: Parameters<typeof _get>[1],
  value: any,
) => {
  return cy
    .log(`expect ${String(path)} to have value ${value}`)
    .getDataLayerEventPropertyValue(event, path)
    .should('eq', value)
}

Cypress.Commands.add(
  'checkDataLayerEventPropertyValue',
  checkDataLayerEventPropertyValue,
)

const verifyDataLayerEventProperty = (
  event: DemoShopTrackingEvent,
  path: Parameters<typeof _get>[1],
) => {
  return cy
    .log(`expect ${String(path)} to exist`)
    .getDataLayerEventPropertyValue(event, path)
    .should('not.be.undefined')
}

Cypress.Commands.add(
  'verifyDataLayerEventProperty',
  verifyDataLayerEventProperty,
)

const verifyDataLayerHasEcommerceNullBefore = (
  event: DemoShopTrackingEvent,
) => {
  return cy
    .log("verify that there's a null ecommerce event before a ecommerce event")
    .window({ log: false })
    .then(({ dataLayer }) => {
      let ecommerceNull
      for (let index = 0; index < dataLayer.length; index++) {
        const entry = dataLayer[index]
        if (entry?.event === event) {
          ecommerceNull = dataLayer[index - 1]
        }
      }
      return cy.wrap(ecommerceNull).its('ecommerce').should('be.null')
    })
}

Cypress.Commands.add(
  'verifyDataLayerHasEcommerceNullBefore',
  verifyDataLayerHasEcommerceNullBefore,
)

const expectEventsInOrder = (events: DemoShopTrackingEvent[]) => {
  return cy.window().then(({ dataLayer }) => {
    const eventIndexes: number[] = []
    events.forEach((event) => {
      const eventIndex = dataLayer.findIndex(
        (dataLayerEvent) => dataLayerEvent.event === event,
      )
      eventIndexes.push(eventIndex)
    })

    return cy
      .log(`expect ${events} to be in this exact order`)
      .wrap(eventIndexes)
      .should('not.be.empty')
      .should('have.length', events.length) // all the events should at least exist
      .should(
        'deep.equal',
        [...eventIndexes].sort((a, b) => a - b), // asc order
      )
  })
}
Cypress.Commands.add('expectEventsInOrder', expectEventsInOrder)
