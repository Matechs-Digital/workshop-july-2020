const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("../../tsconfig");

module.exports = {
  testPathIgnorePatterns: ["node_modules", "esm"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/../../",
  }),
  collectCoverageFrom: ["<rootDir>/src/**", "<rootDir>/pages/**"],
  setupFilesAfterEnv: ["./jest.setup.ts"]
};
