import { defineConfig } from "prisma/config";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";

for (const envFile of [".env.local", ".env"]) {
  const fullPath = resolve(process.cwd(), envFile);
  if (existsSync(fullPath)) {
    loadEnv({ path: fullPath, override: false });
  }
}

const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!migrationUrl) {
  throw new Error("Missing DIRECT_URL or DATABASE_URL in .env.local/.env");
}

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
