import { NextResponse } from "next/server";

import type { AppLocale } from "@/i18n/routing";
import { getMessage } from "@/lib/i18n/message";
import { getRequestLocaleFromRequest } from "@/lib/i18n/locale";

export function apiError(
  request: Request,
  key: string,
  status: number,
  locale?: AppLocale,
): NextResponse<{ error: string }> {
  const resolvedLocale = locale ?? getRequestLocaleFromRequest(request);

  return NextResponse.json(
    { error: getMessage(resolvedLocale, `errors.${key}`) },
    { status },
  );
}

export function apiErrors(
  request: Request,
  errors: Record<string, string>,
  status: number,
): NextResponse<{ success: false; errors: Record<string, string> }> {
  return NextResponse.json({ success: false, errors }, { status });
}

export function localizedApiMessage(
  locale: AppLocale,
  key: string,
  values?: Record<string, string | number>,
): string {
  return getMessage(locale, `errors.${key}`, values);
}
