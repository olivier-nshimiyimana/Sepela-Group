import { neon } from "@neondatabase/serverless";

const rawUrl = process.env.DATABASE_URL?.trim() ?? "";
const withoutQuotes = rawUrl.replace(/^['"]|['"]$/g, "");

function maskUrl(url) {
  try {
    const parsed = new URL(url.replace(/^postgresql:/, "http:"));
    return `${parsed.protocol}//${parsed.username}:****@${parsed.host}${parsed.pathname}${parsed.search}`;
  } catch {
    return "(invalid url)";
  }
}

async function tryConnect(label, url) {
  const sql = neon(url, {
    fetchOptions: { signal: AbortSignal.timeout(20_000) },
  });

  const started = Date.now();
  try {
    const result = await sql`SELECT 1 AS ok`;
    console.log(`${label}: OK in ${Date.now() - started}ms`, result);
    return true;
  } catch (error) {
    console.error(
      `${label}: FAIL in ${Date.now() - started}ms`,
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

console.log("DATABASE_URL (masked):", maskUrl(withoutQuotes));
console.log("Has channel_binding:", withoutQuotes.includes("channel_binding"));
console.log("Has outer quotes in env:", rawUrl !== withoutQuotes);

const withoutChannelBinding = withoutQuotes
  .replace(/[&?]channel_binding=require/g, "")
  .replace(/\?&/, "?")
  .replace(/\?$/, "");

await tryConnect("current URL", withoutQuotes);

if (withoutChannelBinding !== withoutQuotes) {
  await tryConnect("without channel_binding", withoutChannelBinding);
}
