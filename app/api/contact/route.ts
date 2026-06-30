import { NextResponse } from "next/server";

import { createContactSubmission } from "@/lib/contact/storage";
import { getRequestLocaleFromRequest } from "@/lib/i18n/locale";
import { getMessage } from "@/lib/i18n/message";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import {
  contactFormSchema,
  formatZodErrors,
  type ContactFormPayload,
} from "@/lib/validations/contact";

interface ContactSuccessResponse {
  success: true;
  message: string;
}

interface ContactErrorResponse {
  success: false;
  errors: Record<string, string>;
}

export async function POST(
  request: Request,
): Promise<NextResponse<ContactSuccessResponse | ContactErrorResponse>> {
  const locale = getRequestLocaleFromRequest(request);
  const translate = (key: string) => getMessage(locale, key);

  const rateLimit = checkRateLimit(
    `contact:${getClientIp(request)}`,
    5,
    60 * 60 * 1000,
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        errors: { _form: translate("errors.contactRateLimited") },
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: { _form: translate("errors.invalidJson") },
      },
      { status: 400 },
    );
  }

  const result = contactFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        errors: formatZodErrors(result.error, translate),
      },
      { status: 400 },
    );
  }

  const payload: ContactFormPayload = result.data;

  try {
    await createContactSubmission(payload);
  } catch (error) {
    console.error("[contact] Failed to persist submission:", error);
    return NextResponse.json(
      {
        success: false,
        errors: {
          _form: translate("errors.contactSaveFailed"),
        },
      },
      { status: 500 },
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[contact] Submission saved", {
      service: payload.interest,
      briefLength: payload.projectBrief.length,
    });
  }

  return NextResponse.json(
    {
      success: true,
      message: translate("errors.contactSuccess"),
    },
    { status: 200 },
  );
}
