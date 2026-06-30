import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "sepela_admin_session";
const SESSION_MESSAGE = "sepela-admin-session";
const MIN_SESSION_SECRET_LENGTH = 32;
const DEV_SESSION_FALLBACK = "sepela-dev-secret";

function assertProductionAdminConfig(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to at least 32 characters in production",
    );
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password || password === "sepela-admin") {
    throw new Error("ADMIN_PASSWORD must be set to a strong value in production");
  }
}

function getSessionSecret(): string {
  assertProductionAdminConfig();

  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    DEV_SESSION_FALLBACK
  );
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

async function createHmacHex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionToken(): Promise<string> {
  return createHmacHex(getSessionSecret(), SESSION_MESSAGE);
}

export async function isValidAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const expected = await createAdminSessionToken();
  return safeEqual(token, expected);
}

export function verifyAdminPassword(password: string): boolean {
  assertProductionAdminConfig();
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "sepela-admin";
  return safeEqual(password, configuredPassword);
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE;
}

function getTokenFromCookieHeader(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const entry = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`));

  return entry?.slice(`${ADMIN_COOKIE}=`.length);
}

export async function isAdminRequest(
  request: NextRequest | Request,
): Promise<boolean> {
  if ("cookies" in request && typeof request.cookies?.get === "function") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    return isValidAdminSessionToken(token);
  }

  const token = getTokenFromCookieHeader(request.headers.get("cookie"));
  return isValidAdminSessionToken(token);
}
