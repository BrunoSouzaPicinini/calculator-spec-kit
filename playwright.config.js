import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: path.join(__dirname, "tests/integration"),
  reporter: "list",
  use: {
    headless: true,
    baseURL: "http://localhost:8080",
  },
  webServer: {
    command: "npm run serve",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 30000,
    stdout: "ignore",
    stderr: "ignore",
  },
});
