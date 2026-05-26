import config from "../../playwright.config";

const specConfig = {
  ...config,
  testDir: __dirname,
  testMatch: "**/*.spec.ts",
};

export default specConfig;
