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

let migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!migrationUrl) {
  // `prisma generate` does not connect; a dummy URL satisfies config on CI when env
  // is not yet available (e.g. some install phases). Prefer setting DATABASE_URL on Vercel.
  if (process.env.VERCEL === "1" || process.env.CI) {
    migrationUrl = "postgresql://postgres:postgres@127.0.0.1:5432/postgres";
  } else {
    throw new Error("Missing DIRECT_URL or DATABASE_URL in .env.local/.env");
  }
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
