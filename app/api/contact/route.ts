import { NextResponse } from "next/server";

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
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: { _form: "Request body must be valid JSON." },
      },
      { status: 400 },
    );
  }

  const result = contactFormSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        errors: formatZodErrors(result.error),
      },
      { status: 400 },
    );
  }

  const payload: ContactFormPayload = result.data;

  console.log("[contact] New consultation request received:", {
    name: payload.fullName,
    company: payload.companyName,
    email: payload.businessEmail,
    service: payload.interest,
    briefLength: payload.projectBrief.length,
    receivedAt: new Date().toISOString(),
  });

  console.log(
    "[contact] TODO: Dispatch notification via mailing service (Resend / SendGrid)",
  );
  console.log(
    "[contact] TODO: Persist lead record to database (PostgreSQL / Supabase)",
  );

  return NextResponse.json(
    {
      success: true,
      message: "Consultation request received successfully.",
    },
    { status: 200 },
  );
}
