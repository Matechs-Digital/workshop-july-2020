### Exercise 1

Copy the setup made for `@workshop/common` to `@workshop/components`.

After this you should be able to run tests for both projects individually.

### Exercise 2

Add a script to the `workshop/package.json` to run tests in each package using `ultra` like:

```json
{
  "scripts": {
    "test": "ultra -r test",
    "test:coverage": "ultra -r test --coverage"
  }
}
```

### Exercise 3

Install `yarn add -W -D nyc` in the workspace root, in order to merge reports we first have to create a folder and collect all the `coverage-final.json`.

Make a directory called `summary` and copy all the `coverage-final.json` renaming them to `common.json` & `components.json`

Generate an html report by running: `yarn nyc -t ./summary report --reporter=html`

Make a script `test:all` to automate the process of testing & merging reports.

### Exercise 4

Add `@workshop/app` to the setup

At this point running `yarn test:all` should run all of your tests and collect the coverage in a single summary
