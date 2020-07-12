### Topic

Cypress is an e2e test runner that is unique by design, other e2e test runners usually have a server component where the engine and your tests run and a driver that connects to a browser, cypres does the exact opposite.

Cypress runs inside a browser, that means the code of your tests will run in the same environment as your app code.

One very nice property of that is your code and your tests share direct access to a real dom.

### Headless mode

Cypress is able to run in headless mode in a docker environment by spinning up a chromium browser and can produce videos that can feed your manual QA process.

### Live mode

Cypress runs while you code and have a test runner that spin up browsers you have in the system, for example in a windows environment you will be able to test live in browsers like firefox, edge & similar

### Notes

There is still a lot of active development and browser coverage is not extremely good, on the other end the design of running in a browser makes writing new adaprers not an impossible job

### Disadvantages

Cypress runs in a browser, and so it's single threaded by design, if you have multiple tests it cannot run in parallel by default, there is a server protocol that allows for parallelization but it's still very new. Note that in a CI environment you can still have multiple pipelines testing independently sub-packages and only at the end merge the coverages and the videos in a single report.

### Installation

Go through https://docs.cypress.io/guides/getting-started/installing-cypress.html#System-requirements
