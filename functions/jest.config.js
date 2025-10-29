/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/__tests__"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    }
  };
  