### Topic

Starting from the npm-based monorepo created in the `01-npm` step we will convert it to use `lerna`.

As a second step we will integrate lerna to work with `yarn workspaces` and we will convert the yarn-based monorepo of step `02-yarn`

### Exercise 1

Copy from step `01-npm` and clean all `node_modules`.

Install `lerna` in your workspace root, `npm install --save lerna`, run `npx lerna init`.

You should now have a file called `lerna.json` in your `workshop` directory and it should look like:

```json
{
  "packages": ["packages/*"],
  "version": "0.0.0"
}
```

### Exercise 2

add a script to your `workshop/package.json` like:

```json
{
  "scripts": {
    "bootstrap": "lerna bootstrap"
  }
}
```

and run `npm run bootstrap`.

You should now see that each package has been properly initialized and dependencies inter-linked.

### Exercise 3

Change relative `file` imports to versioned dependencies, for example:

- `"@workshop/common": "file:../common"` -> `"@workshop/common": "^0.0.0"`

Run `npm run bootstrap` from the `workshop` root.

You should now have dependencies automatically linked by lerna via symlinks.

### Exercise 4

Add a script to your `workshop/package.json` to run a command selectively:

```json
{
  "scripts": {
    "start:app": "lerna run --scope @workshop/app start"
  }
}
```

Run `npm run start` and see that lerna properly executes the `start` script of `workshop/packages/app`.

Notes:

- not the purpose of this workshop but lerna can also automate versioning of your packages via `lerna version` & `lerna publish` worth to explore the documentation further.

### Exercise 5

Clean all `node_modules` & `package-lock.json`, Change the config `lerna.json` to include :

```json
{
  "npmClient": "yarn"
}
```

Run `yarn` && `yarn bootstrap`.

You should now have each package initialized via yarn.

### Exercise 6

Clean all `node_modules` & `yarn.lock`.

Change the config `lerna.json` to include :

```json
{
  "useWorkspaces": true
}
```

Change the config `package.json` to include :

```json
{
  "workspaces": {
    "packages": ["packages/*"]
  }
}
```

Run `yarn` && `yarn bootstrap`.

You should now have everything bootstrapped using `yarn workspaces`.

Confirm everything works by running `yarn start:app`
