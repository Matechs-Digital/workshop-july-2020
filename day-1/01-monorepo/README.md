### Topic
In this module we will learn how to structure a javascript monorepo in its various forms,
we are going to take a look at a few available open-source tools to manage monorepos.

### Problems
When you develop in monorepos there are a number of things to be considered:
- orchestrating dependencies across the monorepo
- running commands with selectivity across all of the packages
- orchestrate build time
- orchestrate versioning

### Utilities
- `yarn workspaces` optimize dependency management using smart hoisting
- `lerna` solves both running selective commands & versioning
- `ultra-runner` optimizes build execution by smart interpretation of the dependency tree