import { isDatabaseConfigured, getSql } from "@/lib/db/client";
import { withConnectionRetries } from "@/lib/db/retry";

export const DATABASE_UNAVAILABLE_MESSAGE =
  "Database is temporarily unreachable. Verify your Neon pooled DATABASE_URL and network connection.";

export const DATABASE_NOT_CONFIGURED_MESSAGE =
  "DATABASE_URL is not set. Using local JSON data until Neon is configured.";

let databaseReachable: boolean | null = null;
let hasLoggedUnreachable = false;
let lastDatabaseFailureAt = 0;

const DATABASE_RETRY_COOLDOWN_MS = 15_000;

export class DatabaseUnavailableError extends Error {
  constructor(message = DATABASE_UNAVAILABLE_MESSAGE) {
    super(message);
    this.name = "DatabaseUnavailableError";
  }
}

export function isDatabaseConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    error.name === "NeonDbError" ||
    message.includes("fetch failed") ||
    message.includes("error connecting to database") ||
    message.includes("aborted") ||
    message.includes("abort") ||
    message.includes("timeout") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("etimedout") ||
    message.includes("network error") ||
    message.includes("connection refused") ||
    message.includes("connection timed out")
  );
}

function markDatabaseUnreachable(error: unknown): void {
  databaseReachable = false;
  lastDatabaseFailureAt = Date.now();

  if (!hasLoggedUnreachable) {
    hasLoggedUnreachable = true;
    console.warn(
      "[database] Neon unreachable — using local JSON fallback.",
      error instanceof Error ? error.message : error,
    );
  }
}

export function getDatabaseStatusKey(): "notConfigured" | "unavailable" | null {
  if (!isDatabaseConfigured()) {
    return "notConfigured";
  }

  if (databaseReachable === false) {
    return "unavailable";
  }

  return null;
}

/** @deprecated Use getDatabaseStatusKey with translations instead */
export function getDatabaseStatusMessage(): string | null {
  const key = getDatabaseStatusKey();

  if (key === "notConfigured") {
    return DATABASE_NOT_CONFIGURED_MESSAGE;
  }

  if (key === "unavailable") {
    return DATABASE_UNAVAILABLE_MESSAGE;
  }

  return null;
}

export async function isDatabaseReady(): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  if (databaseReachable === false) {
    const cooldownElapsed =
      Date.now() - lastDatabaseFailureAt >= DATABASE_RETRY_COOLDOWN_MS;

    if (!cooldownElapsed) {
      return false;
    }
  }

  try {
    const sql = getSql();
    await withConnectionRetries(() => sql`SELECT 1`);
    databaseReachable = true;
    hasLoggedUnreachable = false;
    return true;
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      markDatabaseUnreachable(error);
      return false;
    }

    throw error;
  }
}

export async function withDatabaseRead<T>(
  query: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  const ready = await isDatabaseReady();

  if (!ready) {
    return fallback();
  }

  try {
    return await query();
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      markDatabaseUnreachable(error);
      return fallback();
    }

    throw error;
  }
}

export async function withDatabaseWrite<T>(
  query: () => Promise<T>,
  jsonFallback?: () => Promise<T>,
): Promise<T> {
  const ready = await isDatabaseReady();

  if (!ready) {
    if (jsonFallback) {
      return jsonFallback();
    }

    throw new DatabaseUnavailableError();
  }

  try {
    return await query();
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      markDatabaseUnreachable(error);

      if (jsonFallback) {
        return jsonFallback();
      }

      throw new DatabaseUnavailableError();
    }

    throw error;
  }
}

export function getApiErrorResponse(error: unknown): {
  key: string;
  status: number;
} {
  if (error instanceof DatabaseUnavailableError) {
    return { key: "databaseUnavailable", status: 503 };
  }

  if (error instanceof Error) {
    return { key: "unexpected", status: 500 };
  }

  return { key: "unexpected", status: 500 };
}
