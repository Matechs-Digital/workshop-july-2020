### Webpack

Install webpack in the workspace root at `00-base/workshop` as a dev dependency

### Cypress

Install cypress in the workspace root at `00-base/workshop` as a dev dependency

create a file calles `cypress.json` in `packages/components` with:

```json
{
  "fixturesFolder": false,
  "testFiles": "**/*e2e.*",
  "viewportWidth": 500,
  "viewportHeight": 500,
  "experimentalComponentTesting": true,
  "componentFolder": "src",
  "nodeVersion": "system",
  "env": {
    "coverage": true
  }
}
```
