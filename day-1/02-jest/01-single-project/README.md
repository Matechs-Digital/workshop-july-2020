### Exercise 1

Start from the final monorepo created in `01-monorepo`.

Add `jest` to your `workshop` root by running `yarn add -D -W jest`

Note: this will add a dependency to your workspace root, in this way all the packages can use it but we have a single place to manage versioning.

### Exercise 2

Add a local jest config to the `@workshop/common` package by creating a `jest.config.js` file in its project root with the following:

```js
module.exports = {};
```

Add to the `common/package.json` file a script to run the tests:

```json
{
  "scripts": { "test": "jest --passWithNoTests" }
}
```

Run `yarn test`.

You should see the following output:

```
yarn run v1.22.4
warning package.json: No license field
$ jest --passWithNoTests
No tests found, exiting with code 0
```

### Exercise 3

Write a simple test in the file `index.test.js` asserting the content of the module.

Jest default lookup will pick any file containing `*.test.js` and search for tests in it.

```js
// for example
const m = require("./index");

describe("common / index", () => {
  it("should contain common", () => {
    expect(m).toStrictEqual({ module: "common" });
  });
});
```

Run `yarn test`.

You should see an output like:

```
$ jest --passWithNoTests
 PASS  ./index.test.js
  common / index
    ✓ should contain common (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.693 s, estimated 1 s
```

### Exercise 4

Run `yarn test --coverage`, you should now have a folder `common/coverage` with the following content:

```
clover.xml
coverage-final.json <- coverage file
lcov-report/ <- coverage report
lcov.info
```

Open the `coverage/lcov-report` folder and open `index.html` to look at the report.

### Exercise 5

Run tests in watch mode `yarn test --watch`
