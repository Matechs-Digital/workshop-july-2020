const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("../../tsconfig");

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/../../",
  }),
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
};
