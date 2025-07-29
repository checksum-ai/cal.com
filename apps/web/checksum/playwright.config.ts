import { defineConfig, devices, type PlaywrightTestConfig } from "@playwright/test";
import { config } from "dotenv";
import { join } from "path";

const os = require("os");

config({ path: join(__dirname, ".env") });

const getOutputFolder = (name: string) => `../../../../apps/web/${name}`;
export default defineConfig({
  testDir: "..",
  timeout: 1000 * 60 * 10,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 1 : os.cpus().length / 2,
  reporter: process.env.CI
    ? [["html", { open: "never", outputFolder: "test-results" }], ["line"]]
    : [
        ["html", { open: "never", outputFolder: getOutputFolder("playwright-report") }],
        ["json", { outputFile: "../../../../apps/web/playwright-report.json" }],
      ],
  use: {
    trace: "on",
    video: "on",
    screenshot: "on",
    locale: "en-US",
    permissions: ["clipboard-read"],
    actionTimeout: 1000 * 10,
    navigationTimeout: 1000 * 30,
    timezoneId: "Europe/London",
    storageState: {
      cookies: [
        {
          // @ts-expect-error - playwright types are not up to date
          url: "http://localhost:3000",
          name: "calcom-timezone-dialog",
          expires: -1,
          value: "1",
        },
      ],
    },
  },
  expect: {
    timeout: 1000 * 10, // set expect (assertion) timeout for 10 seconds
  },
  webServer: [
    {
      command:
        "NEXT_PUBLIC_IS_E2E=1 NODE_OPTIONS='--dns-result-order=ipv4first' yarn workspace @calcom/web dev -p 3000",
      port: 3000,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  projects: [
    {
      name: "chromium",
      testMatch: /checksum.spec/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
