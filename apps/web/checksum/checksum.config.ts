import { RunMode, getChecksumConfig } from "@checksum-ai/runtime";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, ".env") });

if (!process.env.CHECKSUM_API_KEY) {
  throw new Error("CHECKSUM_API_KEY is not set");
}

if (!process.env.CAL_COM_BASE_URL) {
  throw new Error("CAL_COM_BASE_URL is not set");
}

if (!process.env.CAL_COM_LOGIN_URL) {
  throw new Error("CAL_COM_LOGIN_URL is not set");
}

export default getChecksumConfig({
  /**
   * Checksum Run mode. See Readme for more info
   */
  runMode: RunMode.Normal,

  /**
   * Insert here your Checksum API key. You can find it in https://app.checksum.ai/#/settings/
   */
  apiKey: process.env.CHECKSUM_API_KEY,

  /**
   * Define your test run environments and test users within each environment.
   * The environments must be aligned with those set here:
   * https://app.checksum.ai/#/settings/
   */
  environments: [
    {
      name: "cal-com-testing",
      baseURL: process.env.CAL_COM_BASE_URL,
      loginURL: process.env.CAL_COM_LOGIN_URL,
      default: true,
      users: [
        {
          role: "default",
          username: "test",
          password: "test",
          default: true,
        },
      ],
    },
  ],

  options: {
    /**
     * Whether to use Checksum Smart Selector in order to recover from failing to locate an element for an action (see README)
     */
    useChecksumSelectors: false,
    /**
     * Whether to use Checksum AI in order to recover from a failed action or assertion (see README)
     */
    useChecksumAI: {
      actions: true,
      assertions: true,
      visualComparison: false,
    },
    /**
     * Whether to use mock API data when running your tests (see README)
     */
    useMockData: false,
    /**
     * Whether to Upload HTML test reports to app.checksum.ai so they can be viewed through the UI. Only relevant if Playwright reporter config is set to HTML
     * Reports will be saved locally either way (according to Playwright Configs) and can be viewed using the CLI command show-reports.
     */
    hostReports: !!process.env.CI,
    /**
     * Whether to create a PR with healed tests. Only relevant when in Heal mode.
     */
    autoHealPRs: !!process.env.CI,
  },
});
