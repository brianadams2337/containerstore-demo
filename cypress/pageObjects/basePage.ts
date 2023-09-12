export class BasePage {
  open(): void {
    cy.visitAndWait('/')
  }

  waitForPageToBeDisplayed() {
    throw new Error(
      'this method is not implemented. Should be overridden on every page to work',
    )
  }
}
