### Webpack

Install webpack in the workspace root at `00-base/workshop` as a dev dependency

### Cypress

Install cypress in the workspace root at `00-base/workshop` as a dev dependency

Create a new package called `@workshop/components-e2e` in your packages folder.

create a file calles `cypress.json` in `packages/components-e2e` with:

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

copy over the `cypress` folder from `solutions/day-5/workspace/packages/components-e2e` we will go through each part independently.

Install `yarn add -D -W cypress-react-unit-test` in the workspace root
Install `yarn add -D -W babel-loader` in the workspace root
Install `yarn add -D -W @babel/preset-react` in the workspace root
Install `yarn add -D -W @babel/plugin-transform-regenerator` in the workspace root

create a `webpack.config.js` in your `components-e2e` package with the following:

```js
const path = require("path");

module.exports = {
  resolve: {
    extensions: [".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "babel-loader",
      },
    ],
  },
};
```

Add to your `package.json` the following:

```json
{
  "scripts": {
    "e2e:open": "cypress open",
    "e2e:run": "cypress run"
  }
}
```

First run `yarn e2e:open` in the root of `components-e2e`

Also add to your workspace root:

```json
{
  "scripts": {
    "e2e:run": "lerna run e2e:run"
  }
}
```

and update:

```json
{
  "scripts": {
    "test:all": "yarn test:coverage && yarn e2e:run && yarn test:summary"
  }
}
```

Edit `scripts/summary.sh` adding:

```sh
cp packages/components-e2e/coverage/coverage-final.json summary/components-e2e.json
```
