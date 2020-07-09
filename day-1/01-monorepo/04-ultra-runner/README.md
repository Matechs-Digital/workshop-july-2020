### Topic

Up to this point we have optimized for dependency management via `yarn workspaces` and `lerna` took care of
repository management with selective command execution.

The last step is optimize the build execution from when we will introduce one.

### Exercise

Install `ultra-runner` to your `workshop` root via `yarn add -D -W ultra-runner`,

Add a dummy build step to each package like:

```json
{
  "scripts": {
    "build": "echo build app/components/common"
  }
}
```

Add to the `workshop/package.json` the following:

```json
{
  "scripts": {
    "build": "ultra -r --build build"
  }
}
```

Run `yarn build` and you should see an output like:

```
$ ultra -r --build build
✔ @workshop/common at packages/common 19ms
  ✔ build 8ms
    │ changes:
    │
    ✔ $ echo build common 4ms
      │ build common
      │
✔ @workshop/components at packages/components 12ms
  ✔ build 5ms
    │ changes:
    │   + @workshop/common
    ✔ $ echo build components 4ms
      │ build components
      │
✔ @workshop/app at packages/app 12ms
  ✔ build 6ms
    │ changes:
    │   + @workshop/common
    │   + @workshop/components
    ✔ $ echo build app 4ms
      │ build app
      │
success ✨ Done in 133ms
```

Additionally a file called `.ultra.cache.json` has been created in each of your packages,
this should not be committed and should be in your `.gitignore`.

Note: ultra caches builds so if you change only a portion of your program a subsequent build will only
build the changed content and its direct dependencies.
