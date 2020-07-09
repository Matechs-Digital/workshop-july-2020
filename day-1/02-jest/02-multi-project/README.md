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
