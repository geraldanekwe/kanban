// jest.config.ts
import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./", // path to your Next.js app
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // optional, for RTL matchers
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // match tsconfig paths
  },
};

export default createJestConfig(config);
