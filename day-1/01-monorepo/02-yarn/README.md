### Topic

Starting from the npm-based monorepo created in the previous step we will convert it to a `yarn` based one.

We are also going to enable yarn workspaces during the process.

### Exercise 1

Install `yarn` globally with `npm install -g yarn`, remove any `package-lock.json` & `node_modules` left from the previous module.

### Exercise 2

Initialize each package & the root individually, you should get the same output as the npm based version with the exception of having `yarn.lock` in each package instead of `package-lock.json`

### Exercise 3

Remove any `yarn.lock` & `node_modules` left.

Edit the `workspace/package.json` to include `"workspaces": ["packages/*"]` & run `yarn` in the root

### Exercise 4

Change relative `file` imports to versioned dependencies, for example:

- `"@workshop/common": "file:../common"` -> `"@workshop/common": "^0.0.0"`

Run `yarn` from the `workshop` root.

### Exercise 5

Change the config `workspaces` entry of your `workshop/package.json` with:

```json
{
  "workspaces": {
    "packages": ["packages/*"],
    "nohoist": ["**@workshop/common**"]
  }
}
```

Clean all `node_modules`, TIP add the following or equivalent to your scripts (add rimraf to your repo root):

```json
{
  "scripts": {
    "clean": "rimraf ./packages/*/node_modules && rimraf ./node_modules"
  }
}
```

Rerun yarn, `yarn clean && yarn`

You should see that now our `@workshop/common` package is replicated in every sub-package.
