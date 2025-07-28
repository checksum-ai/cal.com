import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(__dirname, ".env") });

export default defineConfig({
  testDir: "..",
  timeout: 1000 * 60 * 10,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [["json", { outputFile: "test-results.json" }]],
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
