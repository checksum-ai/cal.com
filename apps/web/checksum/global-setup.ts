import { execSync } from "child_process";
import { join } from "path";

async function globalSetup() {
  console.log("Running database reset before tests...");

  try {
    execSync("yarn workspace @calcom/prisma db-reset", {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "test",
      },
    });
    console.log("Database reset completed successfully");
  } catch (error) {
    console.error("Failed to reset database:", error);
    throw error;
  }
}

export default globalSetup;
