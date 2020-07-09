### Topic

In this module we will learn how to configure typescript on a monorepo and how to adapt the jest configs to support it.

### Exercise 1

Add `typescript` to the workspace root using `yarn add -D -W typescript`

### Exercise 2

Create the following files in your workspace root:

```json
// tsconfig.commons.json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "include": ["packages/**/**/*.ts", "packages/**/**/*.tsx"],
    "exclude": ["node_modules", "packages/**/node_modules"]
  }
}
```

```json
// tsconfig.build.json
{
  "extends": "./tsconfig.commons.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@workshop/common": ["packages/common/esm"],
      "@workshop/common/*": ["packages/common/esm/*"],
      "@workshop/components": ["packages/components/esm"],
      "@workshop/components/*": ["packages/components/esm/*"]
    }
  }
}
```

```json
// tsconfig.json
{
  "extends": "./tsconfig.commons.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@workshop/common": ["packages/common/src"],
      "@workshop/common/*": ["packages/common/src/*"],
      "@workshop/components": ["packages/components/src"],
      "@workshop/components/*": ["packages/components/src/*"]
    }
  }
}
```

In each package add:

```json
// tsconfig.json
{
  "extends": "../../tsconfig.json",
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

```json
// tsconfig.build.json
{
  "extends": "../../tsconfig.build.json",
  "compilerOptions": {
    "outDir": "esm",
    "module": "esnext",
    "noEmit": false,
    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

Note: we are using 2 different main configs, one used for build and the other used for testing & for intellisense

Create in each package a `src` folder and port the minimal `index.js` to be `index.ts` in each `src`

### Exercise 3

Replace the build command of each package to `tsc -p tsconfig.build.json` & run `yarn build` from the workspace root

### Exercise 4

Install jest types and babel `yarn add --D -W babel-jest @babel/core @babel/preset-env @types/jest @babel/preset-typescript`

Create in each project a file called `babel.config.js` with the following content:

```js
// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
  ],
};
```

and update `jest.config.js` with the following:

```js
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("../../tsconfig");

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/../../",
  }),
};
```

### Exercise 5

Convert your dummy tests to typescript and run all with `yarn test:all` you should now see your coverage report in `coverage/lcov-report/index.html` with all the typescript sources.

### Exercise 6

Convert the package `@workshop/app` to be a next.js project that we will use for our workshop's app.

Install next with `yarn add next` in the `@workshop/app` package.

Update `babel.config.js` to the following:

```js
// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
    "next/babel",
  ],
};
```

Update jest configs to be:

```js
// jest.config.js
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("../../tsconfig");

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/../../",
  }),
  collectCoverageFrom: ["<rootDir>/src/**", "<rootDir>/pages/**"],
};
```

Update `tsconfig.json` to be:

```json
{
  "extends": "../../tsconfig.json",
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "pages/**/*.tsx",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "module": "esnext",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@workshop/common": ["../common/src"],
      "@workshop/common/*": ["../common/src/*"],
      "@workshop/components": ["../components/src"],
      "@workshop/components/*": ["../components/src/*"],
      "@workshop/app": ["../app/src"],
      "@workshop/app/pages": ["../app/src/pages"],
      "@workshop/app/pages/*": ["../app/src/pages/*"],
      "@workshop/app/*": ["../app/src/*"]
    }
  },
  "exclude": ["node_modules"]
}
```

Remove `tsconfig.build.json`

Add `next-env.d.ts` with the following:

```ts
/// <reference types="next" />
/// <reference types="next/types/global" />
```

Create a folder `pages` and a file `pages/index.tsx` with a dummy component exported as a default export.

Create a `tests` directory and in it create a dumb test like:

```ts
import app from "@workshop/app/pages";

describe("app / index", () => {
  it("should contain correct content", () => {
    expect(app());
  });
});
```

Update scripts to be:

```json
{
  "scripts": {
    "start": "next dev",
    "build": "rm -rf .next; next build",
    "test": "jest --passWithNoTests"
  }
}
```

Add `.next` to the `.gitignore`

Run `yarn build` & `yarn test:all` from the workspace root
