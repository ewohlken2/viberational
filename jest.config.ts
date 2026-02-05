import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  cacheDirectory: "<rootDir>/.jest-cache",
  testPathIgnorePatterns: ["<rootDir>/.worktrees/"],
  watchPathIgnorePatterns: ["<rootDir>/.worktrees/"],
};

export default createJestConfig(customJestConfig);
