import { getSql } from "../lib/db/client";
import { runMigrations } from "../lib/db/migrate";
import { withConnectionRetries } from "../lib/db/retry";

async function migrate(): Promise<void> {
  const sql = getSql({ forCli: true });
  await withConnectionRetries(() => runMigrations(sql));
  console.log("Database migrations completed.");
}

migrate().catch((error: unknown) => {
  console.error("Database migration failed:", error);
  process.exit(1);
});
