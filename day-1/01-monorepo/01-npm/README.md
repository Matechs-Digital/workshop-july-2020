### Topic

Creation of a small monorepo structure using `npm`

### Exercise 1

Create a basic monorepo structure with the following package shape:

- `/workshop`
  - `/package.json` with name `workshop` and `private: true` and `"version": "0.0.0"`
  - `/packages`
    - `/common`
      - `/index.js` with a simple dummy export
      - `/package.json` with name `@workshop/common` and `"version": "0.0.0"`
    - `/components`
      - `/index.js` with a simple dummy export
      - `/package.json` with name `@workshop/components`
    - `/app`
      - `/index.js` with a simple dummy export
      - `/package.json` with name `@workshop/app` and `"version": "0.0.0"`

Initialize npm with `npm install` in each of the packages.

### Exercise 2

Setup dependency in the `workshop` monorepo such that:

- `@workshop/app` depends on `@workshop/components` & `@workshop/common`
- `@workshop/components` depends on `@workshop/common`

Note: using `file: ../relative/path` to link modules

### Exercise 3

In the `@workshop/app` module `index.js` import `@workshop/components` & `@workshop/common` and `console.log` their content

### Exercise 4

Add `react` & `react-dom` as a dependency of `@workshop/components` & `@workshop/app`

### Exercise 5

Add `start` in the `scripts` section of `@workshop/app` and run it
