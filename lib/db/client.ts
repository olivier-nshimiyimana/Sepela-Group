import { neon } from "@neondatabase/serverless";

const APP_DB_TIMEOUT_MS = 10_000;
const CLI_DB_TIMEOUT_MS = 30_000;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon pooled connection string to .env.local",
    );
  }

  return databaseUrl;
}

interface GetSqlOptions {
  forCli?: boolean;
}

export function getSql(options: GetSqlOptions = {}) {
  const timeoutMs = options.forCli
    ? Number(process.env.DB_CLI_TIMEOUT_MS ?? CLI_DB_TIMEOUT_MS)
    : Number(process.env.DB_TIMEOUT_MS ?? APP_DB_TIMEOUT_MS);

  return neon(getDatabaseUrl(), {
    fetchOptions: {
      signal: AbortSignal.timeout(timeoutMs),
    },
  });
}

export type SqlClient = ReturnType<typeof getSql>;
